import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createResponse } from '../common/lib/response-handler'; 
import { StatusCode } from '../common/constants';
import { ProductQueryParams } from './product.props';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        const newProduct = await this.productService.create(createProductDto);
        return {
            item: newProduct,
            ...StatusCode.CREATED
        };
    }

    @Get()
    async index(@Query() params: ProductQueryParams) {
        const products = await this.productService.findAll(params);
        return products ? {
            ...products,
            ...StatusCode.SUCCESS
        } : {
            items: null,
            ...StatusCode.NOT_FOUND
        }
    }

    @Get(':id')
    async getProduct(@Param('id') id: number) {
        const product = await this.productService.getProductWithImages(id);
        return product ? {
            item: product,
            ...StatusCode.SUCCESS
        } : {
            item: null,
            ...StatusCode.NOT_FOUND
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        const updatedProduct = await this.productService.update(+id, updateProductDto);
        return {
            item: updatedProduct,
            ...StatusCode.SUCCESS
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.productService.remove(+id);
        return {
            ...StatusCode.NO_CONTENT
        };
    }
}
