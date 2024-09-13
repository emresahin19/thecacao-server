import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Response } from 'express'; 
import { join } from 'path';

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
        // Default values
        const _width = !isNaN(width) && width || 300;  // Default width
        const _height = !isNaN(height) && height || 300;  // Default height
        const _quality = !isNaN(quality) && quality || 80;  // Default quality
        const _format = format || 'webp';  // Default format
        const imagePath = params['0']; 
    
        // Compress the image and get the file path
        const compressedImagePath = await this.imageService.compressImage(imagePath, _width, _height, _format, _quality);
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
