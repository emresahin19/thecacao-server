import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

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
  ) { }

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
      .where('deleted = :deleted', { deleted: false })
      .andWhere('passive = :passive', { passive: false });

    if (name) {
      query.andWhere('name LIKE :name', { name: `%${name}%` });
    }

    if (updated_at) {
      query.andWhere('DATE(updated_at) = :updated_at', { updated_at });
    }

    if (category_id) {
      query.andWhere('category_id = :category_id', { category_id });
    }

    if (price) {
      query.andWhere('price = :price', { price });
    }

    const [items, total] = await query
      .orderBy(`${orderBy}`, orderDirection)
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    for (const item of items) {
      if (item.image_id) {
        item.image = await this.getImage(item.image_id);
      } else {
        item.image = null;
      }
    }

    return { items, total, currentPage: page, lastPage: Math.ceil(total / perPage) };
  }

  findOne(id: number): Promise<Extra> {
    return this.extraRepository.findOne({ where: { id }, relations: ['category'] });
  }

  async create(createExtraDto: CreateExtraDto): Promise<Extra> {
    const existingItem = await this.extraRepository.findOne({
      where: { name: createExtraDto.name },
    });
    if (existingItem) {
      throw new BadRequestException('Bu isimde bir ürün zaten mevcut.');
    }

    if (createExtraDto.imageObj && createExtraDto.imageObj.file) {
      const image = await this.imageService.saveImage(null, createExtraDto.imageObj.file);
      createExtraDto.image_id = image.id;
      delete createExtraDto.imageObj;
    }

    const extra = await this.saveExtra(createExtraDto);
    return extra;
  }

  async update(id: number, updateExtraDto: UpdateExtraDto): Promise<Extra> {
    const existingItem = await this.extraRepository.find({
      where: { name: updateExtraDto.name, id: Not(id) },
    });

    if (existingItem.length >= 1) {
      throw new BadRequestException('Bu isimde bir ürün zaten mevcut.');
    }
    let imageId: number = updateExtraDto.imageObj?.id || null;

    if (updateExtraDto.imageObj && updateExtraDto.imageObj.file) {
      const image = await this.imageService.saveImage(imageId, updateExtraDto.imageObj.file);
      imageId = image.id;
    }

    delete updateExtraDto.imageObj;

    updateExtraDto.id = id;
    updateExtraDto.image_id = imageId;
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

  async getImage(id: number): Promise<Image> {
    return this.imageRepository.findOne({ where: { id } });
  }

  async getExtraWithImage(extraId: number): Promise<Extra> {
    const extra = await this.extraRepository.findOne({ where: { id: extraId } });

    if (extra.image_id) {
      extra.image = await this.getImage(extra.image_id);
    } else {
      extra.image = null;
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
