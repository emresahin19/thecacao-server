import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StatusCode } from '../common/constants';
import { ProductQueryParams } from './product.props';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) {}

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        const newProduct = await this.productService.create(createProductDto, files);
        return {
            item: newProduct,
            ...StatusCode.CREATED
        };
    }

    @Put(':id')
    @UseInterceptors(AnyFilesInterceptor())
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        const item = await this.productService.update(+id, updateProductDto, files);
        return item ? {
            ...StatusCode.SUCCESS
        } : {
            ...StatusCode.NOT_FOUND
        }
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

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.productService.remove(+id);
        return {
            ...StatusCode.NO_CONTENT
        };
    }
}
