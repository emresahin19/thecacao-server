import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraService } from './extra.service';
import { ExtraController } from './extra.controller';
import { Extra } from './entities/extra.entity';
import { ExtraCategory } from '../extra-category/entities/extra-category.entity';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';
import { RedisService } from '../common/redis/redis.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([Extra, ExtraCategory, Image])],
    controllers: [ExtraController],
    providers: [ExtraService, ImageService, RedisService],
    exports: [ExtraService, TypeOrmModule],
})
export class ExtraModule {}
