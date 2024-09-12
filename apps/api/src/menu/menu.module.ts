import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Extra } from '../extra/entities/extra.entity';
import { Setting } from '../setting/entities/setting.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { ProductModule } from '../product/product.module';
import { RedisModule } from '../common/redis/redis.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, Extra, Setting]), 
        ProductModule,
        RedisModule, 
    ],
    controllers: [MenuController],
    providers: [MenuService],
})

export class MenuModule {}