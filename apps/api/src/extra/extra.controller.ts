import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { StatusCode } from '../common/constants';

@Controller('extra')
export class ExtraController {
    constructor(
        private readonly extraService: ExtraService,
    ) {}

    @Post()
    create(@Body() createExtraDto: CreateExtraDto) {
        return this.extraService.create(createExtraDto);
    }

    @Get()
    findAll() {
        return this.extraService.findAll();
    }

    @Get('input-data')
    async inputData() {
        const items = await this.extraService.inputData();
        return {
            items: items,
            ...StatusCode.SUCCESS
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.extraService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExtraDto: UpdateExtraDto) {
        return this.extraService.update(+id, updateExtraDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.extraService.remove(+id);
    }
}
