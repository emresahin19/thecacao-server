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
        @Query('updated_at') updatedAt?: string
    ) {
        const categories = await this.categoryService.findAll(page, perPage, orderBy, orderDirection, name, updatedAt);
        return createResponse(true, categories.items, true); // Liste olduğu için `isArray = true`
    }

    @Get('input-data')
    async inputData() {
        const categories = await this.categoryService.inputData();
        return createResponse(true, categories, true); // Liste olduğu için `isArray = true`
    }
    
    @Get(':id')
    async findOne(@Param('id') id: number) {
        const category = await this.categoryService.findOne(id);
        return category ? createResponse(true, category) : { status: false, item: null }; // Tek bir obje olduğu için `isArray = false`
    }

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const newCategory = await this.categoryService.create(createCategoryDto);
        return {
            status: true,
            item: newCategory,
            ...StatusCode.CREATED
        };
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        const updatedCategory = await this.categoryService.update(id, updateCategoryDto);
        return {
            status: true,
            item: updatedCategory,
            ...StatusCode.SUCCESS
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.categoryService.remove(id);
        return {
            status: true,
            ...StatusCode.NO_CONTENT
        };
    }
}
