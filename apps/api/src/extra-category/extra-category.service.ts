import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExtraCategory } from './entities/extra-category.entity';
import { CreateExtraCategoryDto } from './dto/create-extra-category.dto';
import { UpdateExtraCategoryDto } from './dto/update-extra-category.dto';
import { Image } from '../image/entities/image.entity';
import { ExtraCategoryQueryParams } from './extra-category.props';
import { ImageService } from '../image/image.service';
import { RedisService } from '../common/redis/redis.service';
import { menuCacheKey, revalidateSecretToken, WWW_URL } from '../common/constants';
import axios from 'axios';

@Injectable()
export class ExtraCategoryService {
    constructor(
        @InjectRepository(ExtraCategory)
        private readonly extraCategoryRepository: Repository<ExtraCategory>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private readonly imageService: ImageService,
        private readonly redisService: RedisService,
    ) {}

    async findAll(params: ExtraCategoryQueryParams) {
        const {
            page = 1,
            perPage = 10,
            orderBy = 'updated_at',
            orderDirection = 'DESC',
            name,
            updated_at,
        } = params;

        const query = this.extraCategoryRepository.createQueryBuilder('extraCategory')
            .where('extraCategory.deleted = :deleted', { deleted: false })
            .andWhere('extraCategory.passive = :passive', { passive: false });

        if (name) {
            query.andWhere('extraCategory.name LIKE :name', { name: `%${name}%` });
        }

        if (updated_at) {
            query.andWhere('DATE(extraCategory.updated_at) = :updated_at', { updated_at });
        }

        const [items, total] = await query
            .orderBy(`extraCategory.${orderBy}`, orderDirection)
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();

        for (const item of items) {
            if (item.image_id) {
                item.image = await this.getImage(item.image_id);
            }
        }

        return { items, total, currentPage: page, lastPage: Math.ceil(total / perPage) };
    }

    findOne(id: number): Promise<ExtraCategory> {
        return this.extraCategoryRepository.findOne({ where: { id }, relations: ['image'] });
    }

    async create(createExtraCategoryDto: CreateExtraCategoryDto): Promise<ExtraCategory> {
        let imageId: number = null;

        if (createExtraCategoryDto.imageObj) {
            const image = await this.imageService.saveImage(null, createExtraCategoryDto.imageObj.file);
            imageId = image.id;
        }

        delete createExtraCategoryDto.imageObj;
        createExtraCategoryDto.image_id = imageId;

        const extraCategory = await this.saveExtraCategory(createExtraCategoryDto);
        return extraCategory;
    }

    async update(id: number, updateExtraCategoryDto: UpdateExtraCategoryDto): Promise<ExtraCategory> {
        let imageId: number = updateExtraCategoryDto.imageObj.id || null;

        if (updateExtraCategoryDto.imageObj) {
            const image = await this.imageService.saveImage(imageId, updateExtraCategoryDto.imageObj.file);
            imageId = image.id;
        }

        delete updateExtraCategoryDto.imageObj;
        updateExtraCategoryDto.id = id;
        updateExtraCategoryDto.image_id = imageId;

        const extraCategory = await this.saveExtraCategory(updateExtraCategoryDto);
        return extraCategory;
    }

    async saveExtraCategory(extraCategoryDto: CreateExtraCategoryDto | UpdateExtraCategoryDto): Promise<ExtraCategory> {
        if (!extraCategoryDto.created_at) extraCategoryDto.created_at = new Date();
        if (!extraCategoryDto.updated_at) extraCategoryDto.updated_at = new Date();

        let extraCategory: ExtraCategory;
        if (!extraCategoryDto.id) {
            extraCategory = this.extraCategoryRepository.create(extraCategoryDto);
            await this.extraCategoryRepository.save(extraCategory);
        } else {
            await this.extraCategoryRepository.update(extraCategoryDto.id, extraCategoryDto);
            extraCategory = await this.extraCategoryRepository.findOne({ where: { id: extraCategoryDto.id } });
        }

        await this.clearCache();
        return extraCategory;
    }

    async clearCache() {
        await this.redisService.del(menuCacheKey);
        try {
            await axios.post(`${WWW_URL}/api/revalidate`, {
                secret: revalidateSecretToken,
            });
            console.log(`Revalidate request sent`);
        } catch (error) {
            console.error(`Revalidate request failed`, error.message);
        }
    }

    async remove(id: number): Promise<void> {
        await this.extraCategoryRepository.delete(id);
        await this.clearCache();
    }

    async getImage(imageId: number): Promise<Image> {
        if (!imageId) {
            return null;
        }

        const image = await this.imageRepository.findOne({ where: { id: imageId } });
        return image;
    }

    async getExtraCategoryWithImage(extraCategoryId: number): Promise<ExtraCategory> {
        const extraCategory = await this.extraCategoryRepository.findOne({ where: { id: extraCategoryId } });

        if (extraCategory.image) {
            extraCategory.image_url = await this.imageService.getImageUrlByType(Number(extraCategory.image), 'extra');
        } 

        return extraCategory;
    }
}
