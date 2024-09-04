import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraCategoryService } from './extra-category.service';
import { ExtraCategoryController } from './extra-category.controller';
import { ExtraCategory } from './entities/extra-category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ExtraCategory])],
    controllers: [ExtraCategoryController],
    providers: [ExtraCategoryService],
    exports: [ExtraCategoryService, TypeOrmModule],
})
export class ExtraCategoryModule {}