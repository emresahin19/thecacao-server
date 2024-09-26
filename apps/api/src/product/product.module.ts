import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { Image } from '../image/entities/image.entity';
import { Extra } from '../extra/entities/extra.entity';
import { ImageService } from '../image/image.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Image, Extra])],
    controllers: [ProductController],
    providers: [ProductService, ImageService],
    exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
