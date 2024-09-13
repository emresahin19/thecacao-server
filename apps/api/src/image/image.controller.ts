import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Response } from 'express'; 

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get('crop,t=:type,w=:width,h=:height,f=:format,q=:quality/*')
    async getCroppedImage(
        @Param('type') type: 'product' | 'product-detail' | 'slider' | 'extra',  // Get type if present
        @Param('width', new ParseIntPipe()) width: number,  // Get width as an integer using ParseIntPipe
        @Param('height', new ParseIntPipe()) height: number,  // Get height as an integer using ParseIntPipe
        @Param('format') format: 'png' | 'webp',  // Get format as a string
        @Param('quality', new ParseIntPipe()) quality: number,  // Get quality as an integer using ParseIntPipe
        @Param() params: any,
        @Res() res: Response,
    ) {
        console.log('params', params);
        // Default values if not provided
        const _format = format || 'webp';  // Default format
        const _quality = !isNaN(quality) && quality || 80;  // Default quality
        const imagePath = params['0']; 

        // Define sizes based on type if provided
        const sizes = {
            'product': { width: 300, height: 400 },
            'product-detail': { width: 500, height: 600 },
            'slider': { width: 1200, height: 800 },
            'extra': { width: 100, height: 100 }
        };

        let _width = width || 300;  // Default width
        let _height = height || 300;  // Default height

        // If type is provided, use its dimensions
        if (type && sizes[type]) {
            _width = sizes[type].width;
            _height = sizes[type].height;
        }

        // Compress the image based on type or dimensions and get the file path
        const compressedImagePath = await this.imageService.compressImage({imagePath, width: _width, height: _height, format: _format, quality: _quality});
        
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
