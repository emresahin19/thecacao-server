import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
    constructor(
        @InjectRepository(Setting)
        private readonly settingRepository: Repository<Setting>,
    ) {}

    create(createSettingDto: CreateSettingDto): Promise<Setting> {
        const setting = this.settingRepository.create(createSettingDto);
        return this.settingRepository.save(setting);
    }

    findAll(): Promise<Setting[]> {
        return this.settingRepository.find();
    }

    findOne(id: number): Promise<Setting> {
        return this.settingRepository.findOne({ where: { id } });
    }

    async update(id: number, updateSettingDto: UpdateSettingDto): Promise<Setting> {
        await this.settingRepository.update(id, updateSettingDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.settingRepository.delete(id);
    }
}
