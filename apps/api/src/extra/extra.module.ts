import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraService } from './extra.service';
import { ExtraController } from './extra.controller';
import { Extra } from './entities/extra.entity';
import { ExtraCategory } from '../extra-category/entities/extra-category.entity';
import { ExtraCategoryModule } from '../extra-category/extra-category.module';

@Module({
    imports: [ExtraCategoryModule, TypeOrmModule.forFeature([Extra, ExtraCategory])],
    controllers: [ExtraController],
    providers: [ExtraService],
    exports: [ExtraService, TypeOrmModule],
})
export class ExtraModule {}
