import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Extra } from '../extra/entities/extra.entity';
import { Setting } from '../setting/entities/setting.entity';
import { ProductService } from '../product/product.service';
import { RedisService } from '../common/redis/redis.service';
import { menuCacheKey } from '../common/constants';
import { ExtraCategory } from '../extra-category/entities/extra-category.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Extra)
        private readonly extraRepository: Repository<Extra>,
        @InjectRepository(Setting)
        private readonly settingRepository: Repository<Setting>,
        @InjectRepository(ExtraCategory)
        private readonly extraCategoryRepository: Repository<ExtraCategory>,
        private readonly productService: ProductService,
        private readonly redisService: RedisService,
        private readonly imageService: ImageService,
    ) {}

    async getMenuData() {
        const cachedData = await this.redisService.get(menuCacheKey);
        const isDev =  process.env.NEXT_PUBLIC_APP_MODE === 'development';
        if (cachedData && !isDev) {
            console.log('serve from cache');
            return cachedData;
        }
        console.log('serve from db');

        const extras = await this.extraCategoryRepository.find({
            where: { deleted: false, passive: false },
            relations: ['extras'],
        })

        extras.forEach((extra) => {
            extra.extras.forEach(async (item) => {
                item.image = item.image_id && await this.imageService.findOne(item.image_id)
            });
        });
    
        const categories = await this.categoryRepository
            .createQueryBuilder('category')
            .select([
                'category.id', 'category.name', 'category.description', 'category.style', 'category.slug', 'category.order',
                'product.id', 'product.name', 'product.slug', 'product.price', 'product.description', 'product.order', 'product.category', 'product.category_id', 'product.image_ids', 'product.extra'
            ])
            .leftJoin('category.products', 'product')
            .where('category.passive = :passive', { passive: 0 })
            .andWhere('category.deleted = :deleted', { deleted: 0 })
            .andWhere('product.passive = :passive', { passive: 0 })
            .andWhere('product.deleted = :deleted', { deleted: 0 })
            .orderBy('category.order', 'ASC')
            .addOrderBy('product.order', 'ASC')
            .getMany();

        const formattedCategories = await Promise.all(
            categories.map(async (category) => {
                category.products = await Promise.all(
                    category.products.map(async (product) => {
                        product.images = await this.productService.getImages(product.image_ids); 
                        product.extras = extras.filter((cat) => cat.extras.find((extra) => product.extra && product.extra.length > 0 && product.extra.includes(extra.id)));
                        delete product.image_ids; 
                        return product;
                    })
                );
                return category;
            })
        );

        const { email, phone, facebook, instagram, linkedin } = await this.getContactData();
        
        const contacts = {
            email: email,
            phone: phone,
            facebook: facebook,
            instagram: instagram,
            linkedin: linkedin,
        };

        const responseData = {
            status: true,
            items: formattedCategories || [],
            contacts: contacts || [],
        };

        await this.redisService.set(menuCacheKey, responseData, 3600);

        return responseData;
    }

    async getContactData() {
        const email = await this.settingRepository.findOne({ where: { key: 'email' } });
        const phone = await this.settingRepository.findOne({ where: { key: 'phone' } });
        const facebook = await this.settingRepository.findOne({ where: { key: 'facebook' } });
        const instagram = await this.settingRepository.findOne({ where: { key: 'instagram' } });
        const linkedin = await this.settingRepository.findOne({ where: { key: 'linkedin' } });

        return {
            status: true,
            email: email?.value || '',
            phone: phone?.value || '',
            facebook: facebook?.value || '',
            instagram: instagram?.value || '',
            linkedin: linkedin?.value || '',
        };
    }
}
