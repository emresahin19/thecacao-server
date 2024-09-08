import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';

import { CategoryModule } from './category/category.module';
import { ExtraModule } from './extra/extra.module';
import { ExtraCategoryModule } from './extra-category/extra-category.module';
import { ImageModule } from './image/image.module';
import { ProductModule } from './product/product.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';

import { CategoryService } from './category/category.service';
import { ExtraService } from './extra/extra.service';
import { ExtraCategoryService } from './extra-category/extra-category.service';
import { ImageService } from './image/image.service';
import { ProductService } from './product/product.service';
import { SettingService } from './setting/setting.service';
import { UserService } from './user/user.service';
import { MenuService } from './menu/menu.service';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => AppDataSource.options,
        }),
        CategoryModule,
        ExtraModule,
        ExtraCategoryModule,
        ImageModule,
        ProductModule,
        SettingModule,
        UserModule,
        MenuModule,
        RedisModule,
    ],
    providers: [
        CategoryService,
        ExtraService,
        ExtraCategoryService,
        ImageService,
        ProductService,
        SettingService,
        UserService,
        MenuService,
        RedisService,
    ],
})

export class AppModule {}
