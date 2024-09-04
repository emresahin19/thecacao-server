import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Setting } from './entities/setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Setting])],
    controllers: [SettingController],
    providers: [SettingService],
    exports: [SettingService, TypeOrmModule],
})

export class SettingModule {}