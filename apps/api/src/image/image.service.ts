import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { ImageTypes, ImageVariant } from './image.props';
import { cdnUrl } from '../common/constants';
import { MemoryStoredFile } from 'nestjs-form-data';

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
        try {
            return this.imageRepository.findOne({ where: { id } });
        } catch (error) {
            throw new Error('Image not found');
        }
    }

    async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
        await this.imageRepository.update(id, updateImageDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.imageRepository.delete(id);
    }

    async getImageUrlByType(id: number, type: ImageTypes): Promise<string> {
        const image = await this.findOne(id);
        if (!image) {
            throw new Error('Image not found');
        }

        return `${cdnUrl}/images/${type}/${image.filename}`;
    }

    async compressImage({
        imagePath,
        width,
        height,
        format = 'webp',
        quality = 80,
        type = 'product',  
    }: {
        imagePath: string;
        width?: number;
        height?: number;
        format?: 'png' | 'webp';
        quality?: number;
        type?: ImageTypes
    }): Promise<string> {
        const inputFilePath = join(this.inputDir, imagePath);
        // Create dynamic output directory based on type
        const dynamicOutputDir = join(this.outputDir, type);  // E.g., compressed/product or compressed/slider

        if (!existsSync(dynamicOutputDir)) {
            mkdirSync(dynamicOutputDir, { recursive: true });  // Ensure the directory exists
        }
        
        // Dynamic file name: image name + parameters (width, height, format, quality)
        const imageName = imagePath.split('/').pop()?.split('.')[0]; // Image name without extension
        const outputFileName = `${imageName}-${width}x${height}-${quality}.${format}`;
        const outputPath = join(dynamicOutputDir, outputFileName);  // Save to the dynamic folder

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
            position: 'center', // Center the image
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

    async saveFiles(files: Array<MemoryStoredFile>): Promise<number[]> {
        const image_ids: number[] = [];
        
        const savedFiles = files.map(async (file) => {
            const { id } = await this.saveImage(null, file);
            id && image_ids.push(Number(id));
        });

        await Promise.all(savedFiles);

        return image_ids;
    }

    async saveImage(id: number = null, file: MemoryStoredFile): Promise<Image> {
        const filePath = join(this.inputDir, file.originalName);
        writeFileSync(filePath, file.buffer);

        if(id){
            const image = await this.findOne(id);
            if (!image) {
                throw new Error('Image not found');
            }
            await this.imageRepository.update(id, { 
                filename: file.originalName,
                path: filePath,
            });
            return this.findOne(id);
        }

        const newImage = new Image();
        newImage.filename = file.originalName;
        newImage.path = filePath;
    
        await this.imageRepository.save(newImage);
        
        return this.findOne(newImage.id);
    }
}
