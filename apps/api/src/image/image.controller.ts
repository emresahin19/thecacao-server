import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { diskStorage } from 'multer';
import { ImageTypes, ImageVariant } from './image.props';

// File upload destination and filename configuration
const storage = diskStorage({
    destination: join(__dirname, '..', '..', '..', '..', 'media', 'storage', 'image'),  // File upload destination
    filename: (req, file, cb) => {
        const filename = `${file.originalname}`;
        cb(null, filename);
    },
});

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
        @Param('type') type: ImageTypes,
        @Param() params: any,
        @Res() res: Response,
    ) {
        const imagePath = params['0']; 
        const sizes: {
            [key in ImageTypes]: ImageVariant;
        } = {
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
            },
            'table-avatar': {
                width: 64,
                height: 40,
                quality: 80,
                format: 'webp' as const
            }
        };
        
        if(!sizes[type]) {
            return res.status(404).send('Invalid image type');
        }

        const { width, height, format = 'webp', quality }: ImageVariant = sizes[type as ImageTypes];

        // Compress the image based on the type and get the file path
        const compressedImagePath = await this.imageService.compressImage({imagePath, width, height, format, quality, type});

        // Send the image file to the browser
        res.sendFile(compressedImagePath);
    }

    @Get()
    findAll() {
        return this.imageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.imageService.findOne(+id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { storage }))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            return { path: file?.filename }; 
        } catch (error) {
            console.error('Error uploading image:', error);
            throw { path: '' }; 
        }
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
