import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from './news/news.module';
import { NewsService } from './news/news.service';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { CategoryService } from './category/category.service';
import { UserService } from './user/user.service';
import { AppDataSource } from '../data-source';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => AppDataSource.options,
        }),
        NewsModule,
        CategoryModule,
        UserModule,
    ],
    providers: [
        NewsService,
        CategoryService,
        UserService,
    ],
})

export class AppModule {}
