import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Image } from '../image/entities/image.entity';
import { cdnUrl, menuCacheKey, revalidateSecretToken, WWW_URL } from '../common/constants';
import { OrderProps, ProductQueryParams } from './product.props';
import { ImageService } from '../image/image.service';
import slugify from 'slugify';
import { RedisService } from '../common/redis/redis.service';
import axios from 'axios';
import { Category } from '../category/entities/category.entity';
import { clearCache } from '../common/lib/clear-cache';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly imageService: ImageService,
        private readonly redisService: RedisService
    ) {}

    async findAll(params: ProductQueryParams) {
        const { 
            page = 1, 
            perPage = 10, 
            orderBy = 'updated_at', 
            orderDirection = 'DESC', 
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

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const existingItem = await this.categoryRepository.findOne({
            where: { name: createProductDto.name },
        });
        if (existingItem) {
            throw new BadRequestException('Bu isimde bir ürün zaten mevcut.');
        }
        const image_ids = createProductDto.files && createProductDto.files.length > 0
            ? await this.imageService.saveFiles(createProductDto.files.map(fileObject => fileObject.file))
            : [];

        delete createProductDto.files;
        createProductDto.image_ids = image_ids;
        const product = await this.saveProduct(createProductDto);
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const existingItem = await this.categoryRepository.find({
            where: { name: updateProductDto.name, id: Not(id) },
        });
        if (existingItem.length >= 1) {
            throw new BadRequestException('Bu isimde bir ürün zaten mevcut.');
        }
        const image_ids: number[] = [];

        if(updateProductDto.files && updateProductDto.files.length > 0){
            const imageUpdates = updateProductDto.files.map(async (fileObject) => {
                const imgId = fileObject.id || null;
                const file = fileObject.file;

                const { id } = file
                    ? await this.imageService.saveImage(imgId, file)
                    : { id: imgId };
    
                id && image_ids.push(Number(id));
            });
    
            await Promise.all(imageUpdates);
        }
        delete updateProductDto.files;
        
        updateProductDto.id = id;
        updateProductDto.image_ids = image_ids;
        const product = await this.saveProduct(updateProductDto);
        return product; 
    }

    async saveProduct(productDto: CreateProductDto | UpdateProductDto): Promise<Product> {
        const isCreate = !productDto.id;

        productDto.slug = slugify(productDto.name, { lower: true });

        if(!productDto.created_at)
            productDto.created_at = new Date();

        if(!productDto.updated_at)
            productDto.updated_at = new Date();

        let product: Product;
        if (isCreate) {
            product = this.productRepository.create(productDto);
            await this.productRepository.save(product);
        } else {
            await this.productRepository.update(productDto.id, productDto);
            product = await this.productRepository.findOne({ where: { id: productDto.id } });
        }

        // const category = await this.categoryRepository.findOne({ where: { id: productDto.category_id } });
        // const revalidatePath = `/menu/${category.slug}/${product.slug}`;
        clearCache({cacheKey: menuCacheKey})
        return product;
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
        clearCache({cacheKey: menuCacheKey})
    }

    async export(ids: number[]) {
        try {
            const products = await this.productRepository.find({
                where: { id: In(ids) },
                relations: ['category'],
            });
            for(const product of products){
                if (product.image_ids && product.image_ids.length > 0) {
                    product.image = await this.getImage(product.image_ids[0]);
                } else {
                    product.image = null;
                }
            }
            return products;
        } catch (error) {
            console.error('Error exporting items:', error);
            throw error;
        }
    }

    async order(items: OrderProps[]): Promise<any> {
        for(const item of items){
            this.productRepository.update({ id: item.id }, { order: item.order });
        }
        clearCache({ cacheKey: menuCacheKey });

        return { message: 'Products order updated successfully' };
    
    }

    async getImages(image_ids: number[]): Promise<Image[]> {
        if (!image_ids || image_ids.length === 0) {
            return [];
        }

        const images =  this.imageRepository
            .createQueryBuilder('image')
            .whereInIds(image_ids)
            .getMany();
            
        const sorted = await images.then((images) => image_ids.map((id) => images.find((image) => image.id === id)));
        return sorted
    }

    async getImage(image_id: number): Promise<Image> {
        if (!image_id) {
            return null;
        }

        const image = await this.imageRepository.findOne({ where: { id: image_id } });
        return image;
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

    async getProductWithImages(productId: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (product.image_ids && product.image_ids.length > 0) {
            product.images = await this.getImages(product.image_ids);
        } else {
            product.images = [];
        }

        return product;
    }

}
