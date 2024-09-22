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

    async findAll(page: number, perPage: number, orderBy: string, orderDirection: 'ASC' | 'DESC', name?: string, updatedAt?: string) {
        const query = this.categoryRepository.createQueryBuilder('category')
            .where('category.deleted = :deleted', { deleted: false });

        if (name) {
            query.andWhere('category.name LIKE :name', { name: `%${name}%` });
        }

        if (updatedAt) {
            query.andWhere('DATE(category.updated_at) = :updatedAt', { updatedAt });
        }

        const [items, total] = await query
            .orderBy(`category.${orderBy}`, orderDirection)
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();

        return { items, total, currentPage: page, lastPage: Math.ceil(total / perPage) };
    }

    findOne(id: number): Promise<Category> {
        return this.categoryRepository.findOne({ where: { id } });
    }

    create(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        await this.categoryRepository.update(id, updateCategoryDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const category = await this.findOne(id);
        category.deleted = true;
        category.passive = true;
        return this.categoryRepository.save(category);
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
