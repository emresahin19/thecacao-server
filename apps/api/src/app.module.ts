import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from './category/category.module';
import { ExtraModule } from './extra/extra.module';
import { ExtraCategoryModule } from './extra-category/extra-category.module';
import { ImageModule } from './image/image.module';
import { ProductModule } from './product/product.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';

import { CategoryService } from './category/category.service';
import { ExtraService } from './extra/extra.service';
import { ExtraCategoryService } from './extra-category/extra-category.service';
import { ImageService } from './image/image.service';
import { ProductService } from './product/product.service';
import { SettingService } from './setting/setting.service';
import { UserService } from './user/user.service';
import { AppDataSource } from '../data-source';

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
        UserModule
    ],
    providers: [
        CategoryService,
        ExtraService,
        ExtraCategoryService,
        ImageService,
        ProductService,
        SettingService,
        UserService,
    ],
})

export class AppModule {}
