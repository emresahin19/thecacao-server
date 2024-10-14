import { Controller, Get, Post, Body, Param, Delete, Query, Put, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createResponse } from '../common/lib/response-handler'; 
import { StatusCode } from '../common/constants';
import { Response } from 'express';
import { CategoryQueryParams } from './category.props';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async index(
        @Query() params: CategoryQueryParams,
        @Res() res: Response
    ) {
        try {
            const items = await this.categoryService.findAll(params);

            return items
                ? res.status(StatusCode.SUCCESS.statusCode).json({
                    status: true,
                    ...items,
                    message: StatusCode.SUCCESS.message,
                })
                : res.status(StatusCode.BAD_REQUEST.statusCode).json({
                    status: false,
                    items: [],
                    message: StatusCode.BAD_REQUEST.message,
                });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.message,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Get('input-data')
    @UseGuards(JwtAuthGuard)
    async inputData() {
        const categories = await this.categoryService.inputData();
        return {
            items: categories,
            ...StatusCode.SUCCESS
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getCategory(
        @Param('id') id: number,
        @Res() res: Response
    ) {
        try {
            const item = await this.categoryService.findOne(id);

            return item
                ? res.status(StatusCode.SUCCESS.statusCode).json({
                    status: true,
                    item,
                    message: StatusCode.SUCCESS.message,
                })
                : res.status(StatusCode.BAD_REQUEST.statusCode).json({
                    status: false,
                    item: null,
                    message: StatusCode.BAD_REQUEST.message,
                });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.message,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Res() res: Response
    ) {
        try {
            const item = await this.categoryService.create(createCategoryDto);

            return item
                ? res.status(StatusCode.CREATED.statusCode).json({
                    status: true,
                    message: StatusCode.CREATED.message,
                })
                : res.status(StatusCode.BAD_REQUEST.statusCode).json({
                    status: false,
                    message: StatusCode.BAD_REQUEST.message,
                });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Res() res: Response
    ) {
        try {
            const item = await this.categoryService.update(+id, updateCategoryDto);

            return item
                ? res.status(StatusCode.SUCCESS.statusCode).json({
                    status: true,
                    message: StatusCode.SUCCESS.message,
                })
                : res.status(StatusCode.BAD_REQUEST.statusCode).json({
                    status: false,
                    message: StatusCode.BAD_REQUEST.message,
                });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            await this.categoryService.remove(+id);
            res.status(StatusCode.NO_CONTENT.statusCode).json({
                status: true,
                message: StatusCode.NO_CONTENT.message,
            });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }
}
