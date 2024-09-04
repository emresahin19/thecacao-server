import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    findOne(id: number): Promise<Category> {
        return this.categoryRepository.findOne({ where: { id } });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        await this.categoryRepository.update(id, updateCategoryDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }
}
