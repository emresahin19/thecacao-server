import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Extra } from '../extra/entities/extra.entity';
import { Setting } from '../setting/entities/setting.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Extra)
        private readonly extraRepository: Repository<Extra>,
        @InjectRepository(Setting)
        private readonly settingRepository: Repository<Setting>,
    ) {}

    async getMenuData() {
        const categories = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.products', 'product')
            .where('category.passive = :passive', { passive: 0 })
            .orderBy('category.order', 'ASC')
            .getMany();

        const formattedCategories = categories.map((category) => {
            category.products = category.products.map((product) => {
                console.log(product);
                // product['images'] = product['image_ids'];  // Assuming you have a relation or a method for images
                product['extra'] = product['extra'];  // Assuming you have a relation or a method for extra
                return product;
            });
            return category;
        });

        const extras = await this.extraRepository
            .createQueryBuilder('extras')
            .leftJoinAndSelect('extras.category', 'category')
            .where('extras.passive = :passive', { passive: 0 })
            .select(['extras.*', 'category.name AS category_name'])
            .orderBy('extras.id', 'ASC')
            .getRawMany();

        const email = await this.settingRepository.findOne({ where: { key: 'email' } });
        const phone = await this.settingRepository.findOne({ where: { key: 'phone' } });
        const facebook = await this.settingRepository.findOne({ where: { key: 'facebook' } });
        const instagram = await this.settingRepository.findOne({ where: { key: 'instagram' } });
        const linkedin = await this.settingRepository.findOne({ where: { key: 'linkedin' } });

        const contacts = {
            email: email?.value || '',
            phone: phone?.value || '',
            facebook: facebook?.value || '',
            instagram: instagram?.value || '',
            linkedin: linkedin?.value || '',
        };

        return {
            status: true,
            items: formattedCategories || [],
            extras: extras || [],
            contacts: contacts || [],
        };
    }
}
