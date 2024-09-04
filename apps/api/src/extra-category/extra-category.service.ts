import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCategory } from './entities/extra-category.entity';
import { CreateExtraCategoryDto } from './dto/create-extra-category.dto';
import { UpdateExtraCategoryDto } from './dto/update-extra-category.dto';

@Injectable()
export class ExtraCategoryService {
    constructor(
        @InjectRepository(ExtraCategory)
        private readonly extraCategoryRepository: Repository<ExtraCategory>,
    ) {}

    create(createExtraCategoryDto: CreateExtraCategoryDto): Promise<ExtraCategory> {
        const extraCategory = this.extraCategoryRepository.create(createExtraCategoryDto);
        return this.extraCategoryRepository.save(extraCategory);
    }

    findAll(): Promise<ExtraCategory[]> {
        return this.extraCategoryRepository.find();
    }

    findOne(id: number): Promise<ExtraCategory> {
        return this.extraCategoryRepository.findOne({ where: { id } });
    }

    async update(id: number, updateExtraCategoryDto: UpdateExtraCategoryDto): Promise<ExtraCategory> {
        await this.extraCategoryRepository.update(id, updateExtraCategoryDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.extraCategoryRepository.delete(id);
    }
}
