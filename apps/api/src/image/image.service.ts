import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync, statSync } from 'fs';
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

@Injectable()
export class ImageService {
    private readonly inputDir = join(__dirname, '..', '..', '..', '..', 'media', 'storage', 'image');
    private readonly outputDir = join(__dirname, '..', '..', '..', '..', 'media', 'storage', 'compressed');
  
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        
    ) {
        if (!existsSync(this.outputDir)) {
            mkdirSync(this.outputDir);
        }
    }

    create(createImageDto: CreateImageDto): Promise<Image> {
        const image = this.imageRepository.create(createImageDto);
        return this.imageRepository.save(image);
    }

    findAll(): Promise<Image[]> {
        return this.imageRepository.find();
    }

    findOne(id: number): Promise<Image> {
        return this.imageRepository.findOne({ where: { id } });
    }

    async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
        await this.imageRepository.update(id, updateImageDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.imageRepository.delete(id);
    }

    async compressImage({
        imagePath,
        width,
        height,
        format = 'webp',
        quality = 80,
    }: {
        imagePath: string;
        width?: number;
        height?: number;
        format?: 'png' | 'webp';
        quality?: number;
    }): Promise<string> {
        const inputFilePath = join(this.inputDir, imagePath);
        // Dynamic file name: image name + parameters (width, height, format, quality)
        const imageName = imagePath.split('/').pop()?.split('.')[0]; // Image name without extension
        const outputFileName = `${imageName}-${width}x${height}-${quality}.${format}`;
        const outputPath = join(this.outputDir, outputFileName);
    
        // Check if the file already exists
        if (existsSync(outputPath)) {
            const stats = statSync(outputPath);
            if (stats.size > 0) {
                return outputPath; // Return if valid file exists
            }
        }
    
        // Proceed with image processing if no valid file exists
        let image = sharp(inputFilePath).resize(width, height, {
            fit: sharp.fit.cover, // Cover to ensure image fills the dimensions
            position: sharp.strategy.entropy // Choose the most "interesting" part of the image
        });
    
        // Compress the image based on format
        if (format === 'png') {
            image = image.png({ quality });
        } else if (format === 'webp') {
            image = image.webp({ quality });
        }
    
        // Save the processed image
        await image.toFile(outputPath);
        return outputPath;
    }
}
