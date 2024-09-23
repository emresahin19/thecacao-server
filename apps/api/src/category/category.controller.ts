import { Controller, Get, Post, Body, Param, Delete, Query, Put, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createResponse } from '../common/lib/response-handler'; 
import { StatusCode } from '../common/constants';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async index(
        @Query('page') page: number = 1,
        @Query('perPage') perPage: number = 10,
        @Query('orderBy') orderBy: string = 'order',
        @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
        @Query('name') name?: string,
        @Query('updated_at') updated_at?: string
    ) {
        const categories = await this.categoryService.findAll(page, perPage, orderBy, orderDirection, name, updated_at);
        return categories ? {
            items: categories,
            ...StatusCode.SUCCESS
        } : {
            items: null,
            ...StatusCode.NOT_FOUND
        }
    }

    @Get('input-data')
    async inputData() {
        const categories = await this.categoryService.inputData();
        return {
            items: categories,
            ...StatusCode.SUCCESS
        }
    }
    
    @Get(':id')
    async findOne(@Param('id') id: number) {
        const category = await this.categoryService.findOne(id);
        return category ? {
            item: category,
            ...StatusCode.SUCCESS
        } : {
            item: null,
            ...StatusCode.NOT_FOUND
        }
    }

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const newCategory = await this.categoryService.create(createCategoryDto);
        return {
            item: newCategory,
            ...StatusCode.CREATED
        };
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        const updatedCategory = await this.categoryService.update(id, updateCategoryDto);
        return {
            item: updatedCategory,
            ...StatusCode.SUCCESS
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.categoryService.remove(id);
        return {
            ...StatusCode.NO_CONTENT
        };
    }
}
