import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ImageService {
    private readonly inputDir = join(__dirname, '..', '..', '..', '..', 'media', 'storage', 'image');
    private readonly outputDir = join(__dirname, '..', '..', '..', '..', 'media', 'storage', 'output-images');
  
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

    async compressImage(imagePath: string, width: number, height: number, format: 'png' | 'webp', quality: number): Promise<string> {
        const inputFilePath = join(this.inputDir, imagePath);
    
        // Dinamik dosya adı: resim adı + parametreler (width, height, format, quality)
        const imageName = imagePath.split('/').pop()?.split('.')[0]; // Resmin adı (dosya uzantısı olmadan)
        const outputFileName = `${imageName}-${width}x${height}-${quality}.${format}`;
        const outputPath = join(this.outputDir, outputFileName);
    
        // Dosya zaten var mı kontrol et
        if (existsSync(outputPath)) {
            return outputPath; // Dosya zaten varsa onu döndür
        }
    
        let image = sharp(inputFilePath).resize(width, height, {
            fit: sharp.fit.cover, // Resmi tam kaplayacak şekilde kesme
            position: sharp.strategy.entropy, // Odak noktasını seçme
        });
    
        // Resmi ilgili formata göre sıkıştır
        if (format === 'png') {
            image = image.png({ quality: quality });
        } else if (format === 'webp') {
            image = image.webp({ quality: quality });
        }
    
        // Resmi belirtilen formatta kaydet
        await image.toFile(outputPath);
        return outputPath;
    }
}
