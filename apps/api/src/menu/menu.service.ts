import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Extra } from '../extra/entities/extra.entity';
import { Setting } from '../setting/entities/setting.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Extra)
        private readonly extraRepository: Repository<Extra>,
        @InjectRepository(Setting)
        private readonly settingRepository: Repository<Setting>,
        private readonly productService: ProductService,
    ) {}

    async getMenuData() {
        const categories = await this.categoryRepository
            .createQueryBuilder('category')
            .select([
                'category.id', 'category.name', 'category.slug', 'category.order', 'category.color', 'category.textColor',
                'product.id', 'product.name', 'product.slug', 'product.price', 'product.description', 'product.order', 'product.category', 'product.image_ids'
            ])
            .leftJoin('category.products', 'product')
            .where('category.passive = :passive', { passive: 0 })
            .andWhere('category.deleted = :deleted', { deleted: 0 }) 
            .orderBy('category.order', 'ASC')
            .addOrderBy('product.order', 'ASC')
            .getMany();

        const formattedCategories = await Promise.all(
            categories.map(async (category) => {
                category.products = await Promise.all(
                    category.products.map(async (product) => {
                        product.images = await this.productService.getImageUrls(product.image_ids);
                        // product.cfImages = await this.productService.getCfImageUrls(product.image_ids);
                        return product;
                    })
                );
                return category;
            })
        );

        const extras = await this.extraRepository
            .createQueryBuilder('extras')
            .leftJoinAndSelect('extras.category', 'category')
            .where('extras.passive = :passive', { passive: 0 })
            .select(['extras.*', 'category.name AS category_name'])
            .orderBy('extras.id', 'ASC')
            .getRawMany();
    
        const { email, phone, facebook, instagram, linkedin } = await this.getContactData();
        
        const contacts = {
            email: email,
            phone: phone,
            facebook: facebook,
            instagram: instagram,
            linkedin: linkedin,
        };
    
        return {
            status: true,
            items: formattedCategories || [],
            extras: extras || [],
            contacts: contacts || [],
        };
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
