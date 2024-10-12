import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Extra } from './entities/extra.entity';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { Image } from '../image/entities/image.entity';
import { ExtraQueryParams } from './extra.props';
import { ImageService } from '../image/image.service';
import { RedisService } from '../common/redis/redis.service';
import { cdnUrl, menuCacheKey, revalidateSecretToken, WWW_URL } from '../common/constants';
import axios from 'axios';
import { ExtraCategory } from '../extra-category/entities/extra-category.entity';

@Injectable()
export class ExtraService {
  constructor(
    @InjectRepository(Extra)
    private readonly extraRepository: Repository<Extra>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(ExtraCategory)
    private readonly extraCategoryRepository: Repository<ExtraCategory>,
    private readonly imageService: ImageService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(params: ExtraQueryParams) {
    const {
      page = 1,
      perPage = 10,
      orderBy = 'updated_at',
      orderDirection = 'DESC',
      name,
      category_id,
      price,
      updated_at,
    } = params;

    const query = this.extraRepository.createQueryBuilder('extra')
      .leftJoinAndSelect('extra.category', 'category')
      .where('extra.deleted = :deleted', { deleted: false })
      .andWhere('extra.passive = :passive', { passive: false });

    if (name) {
      query.andWhere('extra.name LIKE :name', { name: `%${name}%` });
    }

    if (updated_at) {
      query.andWhere('DATE(extra.updated_at) = :updated_at', { updated_at });
    }

    if (category_id) {
      query.andWhere('extra.category_id = :category_id', { category_id });
    }

    if (price) {
      query.andWhere('extra.price = :price', { price });
    }

    const [items, total] = await query
      .orderBy(`extra.${orderBy}`, orderDirection)
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    for (const item of items) {
      if (item.image_ids && item.image_ids.length > 0) {
        item.images = await this.getImages(item.image_ids);
      } else {
        item.images = [];
      }
    }

    return { items, total, currentPage: page, lastPage: Math.ceil(total / perPage) };
  }

  findOne(id: number): Promise<Extra> {
    return this.extraRepository.findOne({ where: { id }, relations: ['category'] });
  }

  async create(createExtraDto: CreateExtraDto): Promise<Extra> {
    let imageId: number = null;

    if (createExtraDto.imageObj) {
        const image = await this.imageService.saveImage(null, createExtraDto.imageObj.file);
        imageId = image.id;
    }

    delete createExtraDto.imageObj;
    createExtraDto.image = imageId;
    const image_ids = createExtraDto.images && createExtraDto.images.length > 0
      ? await this.imageService.saveFiles(createExtraDto.images.map(fileObject => fileObject.file))
      : [];

    delete createExtraDto.images;
    createExtraDto.image_ids = image_ids;
    const extra = await this.saveExtra(createExtraDto);
    return extra;
  }

  async update(id: number, updateExtraDto: UpdateExtraDto): Promise<Extra> {
    let imageId: number = updateExtraDto.imageObj.id || null;

    if (updateExtraDto.imageObj) {
        const image = await this.imageService.saveImage(imageId, updateExtraDto.imageObj.file);
        imageId = image.id;
    }

    delete updateExtraDto.imageObj;

    updateExtraDto.id = id;
    updateExtraDto.image = imageId;
    const extra = await this.saveExtra(updateExtraDto);
    return extra;
  }

  async saveExtra(extraDto: CreateExtraDto | UpdateExtraDto): Promise<Extra> {
    if (!extraDto.created_at) extraDto.created_at = new Date();
    if (!extraDto.updated_at) extraDto.updated_at = new Date();

    let extra: Extra;
    if (!extraDto.id) {
      extra = this.extraRepository.create(extraDto);
      await this.extraRepository.save(extra);
    } else {
      await this.extraRepository.update(extraDto.id, extraDto);
      extra = await this.extraRepository.findOne({ where: { id: extraDto.id } });
    }

    await this.clearCache();
    return extra;
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

  async remove(id: number): Promise<void> {
    await this.extraRepository.delete(id);
    await this.clearCache();
  }

  async getImages(image_ids: number[]): Promise<Image[]> {
    if (!image_ids || image_ids.length === 0) {
      return [];
    }

    const images = await this.imageRepository
      .createQueryBuilder('image')
      .whereInIds(image_ids)
      .getMany();

    return image_ids.map((id) => images.find((image) => image.id === id));
  }

  async getExtraWithImages(extraId: number): Promise<Extra> {
    const extra = await this.extraRepository.findOne({ where: { id: extraId } });

    if (extra.image_ids && extra.image_ids.length > 0) {
      extra.images = await this.getImages(extra.image_ids);
    } else {
      extra.images = [];
    }

    return extra;
  }

  async inputData() {
      try {
          const categories = await this.extraCategoryRepository.find({ where: { deleted: false, passive: false }, relations: ['extras'] });

          const items = categories.map(category => ({
              value: category.id,
              label: category.name,
              options: category.extras.map(extra => ({ 
                  value: extra.id, 
                  label: extra.name 
              })),
          }));

          return items;
      } catch (error) {
          console.error('Error fetching input data:', error);
          throw new Error('Could not fetch extra input data');
      }
  }
}
