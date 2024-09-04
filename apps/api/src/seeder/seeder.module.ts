import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsSeederService } from './news-seeder/seeder.service';
import { News } from '../news/entities/news.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { CategorySeederService } from './category-seeder/seeder.service';
import { UserSeederService } from './user-seeder/seeder.service';
import { AppDataSource } from '../../data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        useFactory: () => AppDataSource.options,
    }),
    TypeOrmModule.forFeature([News, Category, User])
  ],
  providers: [NewsSeederService, CategorySeederService, UserSeederService],
})
export class SeederModule {}
