import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraCategoryService } from './extra-category.service';
import { ExtraCategoryController } from './extra-category.controller';
import { ExtraCategory } from './entities/extra-category.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Extra } from '../extra/entities/extra.entity';
import { ExtraService } from '../extra/extra.service';
import { ImageService } from '../image/image.service';
import { RedisService } from '../common/redis/redis.service';
import { Image } from '../image/entities/image.entity';

@Module({
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([Extra, ExtraCategory, Image])],
    controllers: [ExtraCategoryController],
    providers: [ExtraCategoryService, ExtraService, ImageService, RedisService],
    exports: [ExtraCategoryService, TypeOrmModule],
})
export class ExtraCategoryModule {}