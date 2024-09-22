import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { ExtraCategory } from '../extra-category/entities/extra-category.entity';

@Injectable()
export class ExtraService {
    constructor(
        @InjectRepository(Extra)
        private readonly extraRepository: Repository<Extra>,
        @InjectRepository(ExtraCategory)
        private readonly extraCategoryRepository: Repository<ExtraCategory>,
    ) {}

    create(createExtraDto: CreateExtraDto): Promise<Extra> {
        const extra = this.extraRepository.create(createExtraDto);
        return this.extraRepository.save(extra);
    }

    findAll(): Promise<Extra[]> {
        return this.extraRepository.find();
    }

    findOne(id: number): Promise<Extra> {
        return this.extraRepository.findOne({ where: { id } });
    }

    async update(id: number, updateExtraDto: UpdateExtraDto): Promise<Extra> {
        await this.extraRepository.update(id, updateExtraDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.extraRepository.delete(id);
    }

    async inputData() {
        try {
            const categories = await this.extraCategoryRepository
                .createQueryBuilder('extras_category')
                .leftJoinAndSelect('extras_category.extras', 'extras')
                .select([
                    'extras_category.id',
                    'extras_category.name',
                    'extras.id',
                    'extras.name',
                ])
                .where('extras.deleted = :deleted', { deleted: false })
                .andWhere('extras.passive = :passive', { passive: false })
                .andWhere('extras_category.deleted = :deleted', { deleted: false })
                .andWhere('extras_category.passive = :passive', { passive: false })
                .getMany();

            const items = categories.map(category => ({
                value: category.id,
                label: category.name,
                options: category.extras.map(extra => ({
                    value: extra.id,
                    label: extra.name,
                })),
            }));

            return items;
        } catch (error) {
            console.error('Error fetching input data:', error);
            throw new Error('Could not fetch extra input data');
        }
    }
}
