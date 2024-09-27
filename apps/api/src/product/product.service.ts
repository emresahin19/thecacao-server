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
import { ImageService } from '../image/image.service';
import slugify from 'slugify';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private readonly imageService: ImageService,
        private readonly redisService: RedisService
    ) {}

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

    async create(createProductDto: CreateProductDto, files?: Array<Express.Multer.File>): Promise<Product> {
        const image_ids = await this.imageService.saveFiles(files)
        const slug = slugify(createProductDto.name, { lower: true, strict: true });

        createProductDto.image_ids = image_ids;
        createProductDto.slug = slug;

        delete createProductDto.files;
        delete createProductDto.fileMap;

        const product = this.productRepository.create(createProductDto);
        this.redisService.del('menu_data');
        return this.productRepository.save(product);
    }

    async update(id: number, updateProductDto: UpdateProductDto, files?: Array<Express.Multer.File>): Promise<Product> {
        const image_ids: number[] = [];
        const fileMap = JSON.parse(updateProductDto.fileMap);
        const slug = slugify(updateProductDto.name, { lower: true, strict: true });

        if (fileMap) {
            const imageUpdates = await fileMap.map(async (fileObject, index) => {
                const fieldName = fileObject.fieldName;
                const imgId = fileObject.id;
                const file = files && files.find(f => f.fieldname === fieldName) || null;
                
                const { id } = file 
                    ? imgId 
                        ? await this.imageService.updateImage(imgId, file)
                        : await this.imageService.saveImage(file)
                    : { id: imgId };

                    id && image_ids.push(id);
            });
    
            await Promise.all(imageUpdates);
        }

        updateProductDto.slug = slug;
        updateProductDto.image_ids = image_ids;

        delete updateProductDto.files
        delete updateProductDto.fileMap
    
        await this.productRepository.update(id, updateProductDto);
        this.redisService.del('menu_data');
        return this.productRepository.findOne({ where: { id } });    
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
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
