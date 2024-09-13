import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Response } from 'express'; 
import {
    productVariantWidth,
    productVariantHeight,
    productVariantQuality,
    productDetailVariantWidth,
    productDetailVariantHeight,
    productDetailVariantQuality,
    sliderVariantWidth,
    sliderVariantHeight,
    sliderVariantQuality,
    extraImageWidth,
    extraImageHeight,
    extraImageQuality,
} from '../common/constants/constants';

export interface ImageVariant {
    width: number;
    height: number;
    format: 'png' | 'webp';
    quality: number;
}

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get('crop,w=:width,h=:height,f=:format,q=:quality/*')
    async getCroppedImage(
        @Param('width', new ParseIntPipe()) width: number,  // Get width as an integer using ParseIntPipe
        @Param('height', new ParseIntPipe()) height: number,  // Get height as an integer using ParseIntPipe
        @Param('format') format: 'png' | 'webp',  // Get format as a string
        @Param('quality', new ParseIntPipe()) quality: number,  // Get quality as an integer using ParseIntPipe
        @Param() params: any,
        @Res() res: Response,
    ) {
        // Handle dynamic crop requests
        const _format = format || 'webp';  // Default format
        const _quality = !isNaN(quality) && quality || 80;  // Default quality
        const imagePath = params['0']; 

        const _width = width || 300;  // Default width
        const _height = height || 300;  // Default height

        // Compress the image based on provided dimensions
        const compressedImagePath = await this.imageService.compressImage({imagePath, width: _width, height: _height, format: _format, quality: _quality});
        
        // Send the image file to the browser
        res.sendFile(compressedImagePath);
    }

    @Get(':type/*')
    async getImageByType(
        @Param('type') type: 'product' | 'product-detail' | 'slider' | 'extra',
        @Param() params: any,
        @Res() res: Response,
    ) {
        const imagePath = params['0']; 
        const sizes = {
            'product': { 
                width: productVariantWidth,
                height: productVariantHeight,
                quality: productVariantQuality,
                format: 'webp' as const
            },
            'product-detail': { 
                width: productDetailVariantWidth,
                height: productDetailVariantHeight,
                quality: productDetailVariantQuality,
                format: 'webp' as const
            },
            'slider': { 
                width: sliderVariantWidth,
                height: sliderVariantHeight,
                quality: sliderVariantQuality,
                format: 'webp' as const
            },
            'extra': { 
                width: extraImageWidth,
                height: extraImageHeight,
                quality: extraImageQuality,
                format: 'webp' as const
            }
        };
    
       const { width, height, format = 'webp', quality }: ImageVariant = sizes[type];

        // Compress the image based on the type and get the file path
        const compressedImagePath = await this.imageService.compressImage({imagePath, width, height, format, quality});

        // Send the image file to the browser
        res.sendFile(compressedImagePath);
    }

    @Post()
    create(@Body() createImageDto: CreateImageDto) {
        return this.imageService.create(createImageDto);
    }

    @Get()
    findAll() {
        return this.imageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        console.log('params', id);
        return this.imageService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
        return this.imageService.update(+id, updateImageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.imageService.remove(+id);
    }
}
