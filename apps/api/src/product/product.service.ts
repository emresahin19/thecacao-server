import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Image } from '../image/entities/image.entity';
import { cdnUrl, menuCacheKey, revalidateSecretToken, WWW_URL } from '../common/constants';
import { ProductQueryParams } from './product.props';
import { ImageService } from '../image/image.service';
import slugify from 'slugify';
import { RedisService } from '../common/redis/redis.service';
import axios from 'axios';
import { Category } from '../category/entities/category.entity';

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
        const image_ids = createProductDto.files && createProductDto.files.length > 0
            ? await this.imageService.saveFiles(createProductDto.files.map(fileObject => fileObject.file))
            : [];

        delete createProductDto.files;
        createProductDto.image_ids = image_ids;
        const product = await this.saveProduct(createProductDto);
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
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
        this.clearCache();
        return product;
    }

    async clearCache(){
        await this.redisService.del(menuCacheKey);
        try {
            await axios.post(`${WWW_URL}/api/revalidate`, {
                secret: revalidateSecretToken,
                // ...revalidatePath && { revalidatePath }
            });
            console.log(`Revalidate request sent`);
        } catch (error) {
            console.error(`Revalidate request failed `, error.message);
        }
    }

    async remove(id: number): Promise<void> {
        console.log('Deleting product', id);
        await this.productRepository.delete(id);
        this.clearCache();
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

}
