import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';

@Injectable()
export class ExtraService {
    constructor(
        @InjectRepository(Extra)
        private readonly extraRepository: Repository<Extra>,
    ) {}

    create(createExtraDto: CreateExtraDto): Promise<Extra> {
        const extra = this.extraRepository.create(createExtraDto);
        return this.extraRepository.save(extra);
    }

    findAll(): Promise<Extra[]> {
        return this.extraRepository.find();
    }

    findOne(id: number): Promise<Extra> {
        return this.extraRepository.findOne({ where: { id } });
    }

    async update(id: number, updateExtraDto: UpdateExtraDto): Promise<Extra> {
        await this.extraRepository.update(id, updateExtraDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.extraRepository.delete(id);
    }
}
