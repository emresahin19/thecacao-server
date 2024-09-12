import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createResponse } from '../common/lib/response-handler'; 
import { StatusCode } from '../common/constants';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        const newProduct = await this.productService.create(createProductDto);
        return {
            status: true,
            item: newProduct,
            ...StatusCode.CREATED
        };
    }

    @Get()
    async findAll() {
        const products = await this.productService.findAll();
        return createResponse(true, products, true);
    }

    @Get(':id')
    async getProduct(@Param('id') id: number) {
        const product = await this.productService.getProductWithImageUrls(id);
        return product ? createResponse(true, product) : { status: false, item: null };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        const updatedProduct = await this.productService.update(+id, updateProductDto);
        return {
            status: true,
            item: updatedProduct,
            ...StatusCode.SUCCESS
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.productService.remove(+id);
        return {
            status: true,
            ...StatusCode.NO_CONTENT
        };
    }
}
