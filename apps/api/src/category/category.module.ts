import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { RedisModule } from '../common/redis/redis.module';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Image, Product]), RedisModule],
    controllers: [CategoryController],
    providers: [CategoryService, ImageService, ProductService],
    exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}