import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryParams } from './category.props';
import slugify from 'slugify';
import { RedisService } from '../common/redis/redis.service';
import { menuCacheKey, revalidateSecretToken, WWW_URL } from '../common/constants';
import axios from 'axios';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly redisService: RedisService
    ) {}

    async findAll(params: CategoryQueryParams) {
        const {
            page = 1,
            perPage = 10,
            orderBy = 'updated_at',
            orderDirection = 'DESC',
            name,
            updated_at,
        } = params;

        const query = this.categoryRepository.createQueryBuilder('category')
            .where('category.deleted = :deleted', { deleted: false })
            .andWhere('category.passive = :passive', { passive: false });

        if (name) {
            query.andWhere('category.name LIKE :name', { name: `%${name}%` });
        }

        if (updated_at) {
            query.andWhere('DATE(category.updated_at) = :updated_at', { updated_at });
        }

        const [items, total] = await query
            .orderBy(`category.${orderBy}`, orderDirection.toUpperCase() as "ASC" | "DESC")
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();

        return { items, total, currentPage: page, lastPage: Math.ceil(total / perPage) };
    }

    findOne(id: number): Promise<Category> {
        return this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        createCategoryDto.slug = slugify(createCategoryDto.name, { lower: true });
        if (!createCategoryDto.created_at) createCategoryDto.created_at = new Date();
        if (!createCategoryDto.updated_at) createCategoryDto.updated_at = new Date();

        const category = this.categoryRepository.create(createCategoryDto);
        await this.categoryRepository.save(category);
        await this.clearCache();
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        updateCategoryDto.slug = slugify(updateCategoryDto.name, { lower: true });
        if (!updateCategoryDto.updated_at) updateCategoryDto.updated_at = new Date();

        await this.categoryRepository.update(id, updateCategoryDto);
        const category = await this.categoryRepository.findOne({ where: { id } });
        await this.clearCache();
        return category;
    }

    async remove(id: number) {
        const category = await this.findOne(id);
        category.deleted = true;
        category.passive = true;
        return this.categoryRepository.save(category);
    }

    async clearCache() {
        await this.redisService.del(menuCacheKey);
        try {
            await axios.post(`${WWW_URL}/api/revalidate`, {
                secret: revalidateSecretToken,
            });
            console.log(`Revalidate request sent`);
        } catch (error) {
            console.error(`Revalidate request failed `, error.message);
        }
    }

    async inputData() {
        try {
            const categories = await this.categoryRepository
                .createQueryBuilder('category')
                .select(['category.id AS value', 'category.name AS label'])
                .orderBy('category.order', 'ASC')
                .getRawMany();
    
            return categories;
        } catch (error) {
            console.error('Error fetching input data:', error); // Hata yönetimi ekleyelim
            throw new Error('Could not fetch categories');
        }
    }
    
}
