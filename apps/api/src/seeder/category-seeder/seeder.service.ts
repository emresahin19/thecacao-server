import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Injectable()
export class CategorySeederService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async run() {
        const categories = [
            {
                type: 'Technology',
                title: 'Technology',
                slug: 'technology',
                show_at_home: true,
                show_at_menu: true,
                order: 1,
            },
            {
                type: 'Health',
                title: 'Health',
                slug: 'health',
                show_at_home: true,
                show_at_menu: true,
                order: 2,
            },
            // Diğer kategoriler...
        ];

        await this.categoryRepository.save(categories);
        console.log('Categories seeding completed.');
    }
}
