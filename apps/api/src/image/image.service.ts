import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

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
}
