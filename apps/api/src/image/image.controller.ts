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
        @Param('width', new ParseIntPipe()) width: number,  // ParseIntPipe ile integer olarak al
        @Param('height', new ParseIntPipe()) height: number,  // ParseIntPipe ile integer olarak al
        @Param('format') format: 'png' | 'webp',  // String olarak formatı al
        @Param('quality', new ParseIntPipe()) quality: number,  // ParseIntPipe ile integer olarak al
        @Param() params: any,
        @Res() res: Response,
    ) {
        // Varsayılan değerler
        const _width = !isNaN(width) && width || 300;  // Varsayılan genişlik
        const _height = !isNaN(height) && height || 300;  // Varsayılan yükseklik
        const _quality = !isNaN(quality) && quality || 80;  // Varsayılan kalite
        const _format = format || 'webp';  // Varsayılan format
        const imagePath = params['0']; 
    
        // Resmi sıkıştır ve dosya yolunu al
        const compressedImagePath = await this.imageService.compressImage(imagePath, _width, _height, _format, _quality);
        // Resmi tarayıcıda göster
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
