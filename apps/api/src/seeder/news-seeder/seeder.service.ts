import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../../news/entities/news.entity';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class NewsSeederService {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async run() {
        // Örnek olarak bir kategori ve bir yazar seçiliyor
        const category = await this.categoryRepository.findOne({ where: { id: 1 } });
        const author = await this.userRepository.findOne({ where: { id: 1 } });

        const newsData = [
            {
                title: 'New Tech Innovations',
                slug: 'new-tech-innovations',
                description: 'Innovations in technology.',
                body: '<p>Exciting new developments...</p>',
                category: category,
                author: author,
                word_count: 100,
                related_news_ids: [],
                tags: [],
                keywords: [],
                show_author: true,
                hit: 0,
                shared: {},
                no_comments: false,
                no_ads: false,
                hidden: false,
                hidden_homepage: false,
                passive: false,
                deleted: false,
            },
            // Diğer haberler burada...
        ];

        await this.newsRepository.save(newsData);
        console.log('Seed data inserted successfully.');
    }
}
