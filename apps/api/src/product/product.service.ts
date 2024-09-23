import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Image } from '../image/entities/image.entity';
import { Extra } from '../extra/entities/extra.entity';
import { cdnUrl } from '../common/constants';
import { ProductQueryParams } from './product.props';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    async findAll(params: ProductQueryParams) {
        const { 
            page = 1, 
            perPage = 10, 
            orderBy = 'id', 
            orderDirection = 'ASC', 
            name, 
            category_id,
            price,
            updated_at,
        } = params;

        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.deleted = :deleted', { deleted: false })
            .andWhere('product.passive = :passive', { passive: false });

        if (name) {
            query.andWhere('product.name LIKE :name', { name: `%${name}%` });
        }

        if (updated_at) {
            query.andWhere('DATE(product.updated_at) = :updated_at', { updated_at });
        }

        if (category_id) {
            query.andWhere('product.category_id = :category_id', { category_id });
        }

        if (price) {
            query.andWhere('product.price = :price', { price });
        }

        const [items, total] = await query
            .orderBy(`product.${orderBy}`, orderDirection)
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();

        for(const item of items){
            if (item.image_ids && item.image_ids.length > 0) {
                item.images = await this.getImages(item.image_ids);
            } else {
                item.images = [];
            }
        }

        return { items, total, currentPage: page, lastPage: Math.ceil(total / perPage) };
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

    async getImages(image_ids: number[]): Promise<Image[]> {
        if (!image_ids || image_ids.length === 0) {
            return [];
        }

        return this.imageRepository
            .createQueryBuilder('image')
            .whereInIds(image_ids)
            .getMany();
    }

    async getImageUrls(image_ids: number[]): Promise<string[]> {
        if (!image_ids || image_ids.length === 0) {
            return [];
        }

        const images = await this.imageRepository
            .createQueryBuilder('image')
            .whereInIds(image_ids)
            .getMany();

        return images.map((image) => `${cdnUrl}/images/product/${image.filename}`);
    }

    async getCfImageUrls(image_ids: number[]): Promise<string[]> {
        if (!image_ids || image_ids.length === 0) {
            return [];
        }

        const images = await this.imageRepository
            .createQueryBuilder('image')
            .whereInIds(image_ids)
            .getMany();

        return images.map((image) => image.url);
    }

    async getProductWithImages(productId: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (product.image_ids && product.image_ids.length > 0) {
            product.images = await this.getImages(product.image_ids);
        } else {
            product.images = [];
        }

        return product;
    }

    async getProductWithImageUrls(productId: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (product.image_ids && product.image_ids.length > 0) {
            product.image_urls = await this.getImageUrls(product.image_ids);
        } else {
            product.image_urls = [];
        }

        return product;
    }

}
