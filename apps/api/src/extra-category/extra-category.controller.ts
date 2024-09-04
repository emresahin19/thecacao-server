import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExtraCategoryService } from './extra-category.service';
import { CreateExtraCategoryDto } from './dto/create-extra-category.dto';
import { UpdateExtraCategoryDto } from './dto/update-extra-category.dto';

@Controller('extras-categories')
export class ExtraCategoryController {
    constructor(private readonly extraCategoryService: ExtraCategoryService) {}

    @Post()
    create(@Body() createExtraCategoryDto: CreateExtraCategoryDto) {
        return this.extraCategoryService.create(createExtraCategoryDto);
    }

    @Get()
    findAll() {
        return this.extraCategoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.extraCategoryService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExtraCategoryDto: UpdateExtraCategoryDto) {
        return this.extraCategoryService.update(+id, updateExtraCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.extraCategoryService.remove(+id);
    }
}
