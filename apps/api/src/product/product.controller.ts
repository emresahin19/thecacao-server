import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StatusCode } from '../common/constants';
import { OrderProps, ProductQueryParams } from './product.props';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) {}

    @Post()
    @FormDataRequest() 
    async create(
        @Body() createProductDto: CreateProductDto,
        @Res() res: Response
    ) {
        try {
            const item = await this.productService.create(createProductDto)
            
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

    @Post('order')
    async order(
        @Body() items: OrderProps[],
        @Res() res: Response
    ) {
        try {
            const response = await this.productService.order(items);
            return res.status(StatusCode.SUCCESS.statusCode).json(response);
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Post('export')
    @UseGuards(JwtAuthGuard)
    async export(
        @Body() body: { ids: number[] },
        @Res() res: Response
    ) {
        try {
            const items = await this.productService.export(body.ids);

            return items
                ? res.status(StatusCode.SUCCESS.statusCode).json({
                    status: true,
                    items,
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

    @Put(':id')
    @FormDataRequest() 
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Res() res: Response
    ) {
        try {
            const item = await this.productService.update(+id, updateProductDto);
            
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

    @Get()
    async index(
        @Query() params: ProductQueryParams,
        @Res() res: Response
    ) {
        try {
            const items = await this.productService.findAll(params);
            
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
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Get(':id')
    async getProduct(
        @Param('id') id: number,
        @Res() res: Response
    ) {
        try {
            const item = await this.productService.getProductWithImages(id);
            
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
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            await this.productService.remove(+id);
            res.status(StatusCode.NO_CONTENT.statusCode).json({
                status: true,
                message: StatusCode.NO_CONTENT.message,
            })
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.error,
                message: error.message || StatusCode.BAD_REQUEST.message,
            });
        }
    }
}
