import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { RedisModule } from '../common/redis/redis.module';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), RedisModule],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}