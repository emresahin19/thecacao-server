import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Image } from '../image/entities/image.entity';
import { Extra } from '../extra/entities/extra.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        @InjectRepository(Extra)
        private readonly extraRepository: Repository<Extra>,
    ) {}

    create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    findAll(): Promise<Product[]> {
        return this.productRepository.find({ relations: ['category'] });
    }

    findOne(id: number): Promise<Product> {
        return this.productRepository.findOne({ where: { id }, relations: ['category'] });
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        await this.productRepository.update(id, updateProductDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
    
    async getProductWithImagesAndExtras(productId: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images', 'extraItems'],
        });
    
        if (product.image_ids && Array.isArray(product.image_ids) && product.image_ids.length > 0) {
            const images = await this.imageRepository
                .createQueryBuilder('image')
                .whereInIds(product.image_ids)
                .getMany();
            product.images = images
        }
    
        if (product.extra && Array.isArray(product.extra) && product.extra.length > 0) {
            product.extraItems = await this.extraRepository
                .createQueryBuilder('extra')
                .leftJoinAndSelect('extra.category', 'category')
                .whereInIds(product.extra)
                .select(['extra.*', 'category.name AS category_name'])
                .getMany();
        }
    
        return product;
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await this.productRepository.find({
            relations: ['images', 'extraItems'], 
        });

        for (const product of products) {
            if (product.image_ids && Array.isArray(product.image_ids) && product.image_ids.length > 0) {
                product.images = await this.imageRepository
                    .createQueryBuilder('image')
                    .whereInIds(product.image_ids)
                    .getMany();
                }

            if (product.extra && Array.isArray(product.extra) && product.extra.length > 0) {
                product.extraItems = await this.extraRepository
                    .createQueryBuilder('extra')
                    .leftJoinAndSelect('extra.category', 'category')
                    .whereInIds(product.extra)
                    .select(['extra.*', 'category.name AS category_name'])
                    .getMany();
                }
        }

        return products;
    }
}
