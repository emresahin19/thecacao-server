import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { RedisModule } from '../common/redis/redis.module';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Image]), RedisModule],
    controllers: [CategoryController],
    providers: [CategoryService, ImageService],
    exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}