import { Controller, Get, Post, Body, Put, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { StatusCode } from '../common/constants';
import { ExtraQueryParams } from './extra.props';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('extra')
export class ExtraController {
  constructor(private readonly extraService: ExtraService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  async create(@Body() createExtraDto: CreateExtraDto, @Res() res: Response) {
    try {
      const item = await this.extraService.create(createExtraDto);

      return item
        ? res.status(StatusCode.CREATED.statusCode).json({
            status: true,
            message: StatusCode.CREATED.message,
          })
        : res.status(StatusCode.BAD_REQUEST.statusCode).json({
            status: false,
            message: StatusCode.BAD_REQUEST.message,
          });
    } catch (error) {
      return res.status(StatusCode.BAD_REQUEST.statusCode).json({
        status: false,
        error: error.message,
        message: error.message || StatusCode.BAD_REQUEST.message,
      });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  async update(@Param('id') id: string, @Body() updateExtraDto: UpdateExtraDto, @Res() res: Response) {
    try {
      const item = await this.extraService.update(+id, updateExtraDto);

      return item
        ? res.status(StatusCode.SUCCESS.statusCode).json({
            status: true,
            message: StatusCode.SUCCESS.message,
          })
        : res.status(StatusCode.BAD_REQUEST.statusCode).json({
            status: false,
            message: StatusCode.BAD_REQUEST.message,
          });
    }  catch (error) {
      return res.status(StatusCode.BAD_REQUEST.statusCode).json({
        status: false,
        error: error.error,
        message: error.message || StatusCode.BAD_REQUEST.message,
      });
    }
  }

  @Get('input-data')
  @UseGuards(JwtAuthGuard)
  async inputData() {
      const items = await this.extraService.inputData();
      return {
          items: items,
          ...StatusCode.SUCCESS
      };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Query() params: ExtraQueryParams, @Res() res: Response) {
    try {
      const items = await this.extraService.findAll(params);

      return items
        ? res.status(StatusCode.SUCCESS.statusCode).json({
            status: true,
            ...items,
            message: StatusCode.SUCCESS.message,
          })
        : res.status(StatusCode.BAD_REQUEST.statusCode).json({
            status: false,
            items: [],
            message: StatusCode.BAD_REQUEST.message,
          });
    } catch (error) {
      return res.status(StatusCode.BAD_REQUEST.statusCode).json({
        status: false,
        error: error.message,
        message: error.message || StatusCode.BAD_REQUEST.message,
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getExtra(@Param('id') id: number, @Res() res: Response) {
    try {
      const item = await this.extraService.getExtraWithImage(id);

      return item
        ? res.status(StatusCode.SUCCESS.statusCode).json({
            status: true,
            item,
            message: StatusCode.SUCCESS.message,
          })
        : res.status(StatusCode.BAD_REQUEST.statusCode).json({
            status: false,
            item: null,
            message: StatusCode.BAD_REQUEST.message,
          });
    } catch (error) {
      return res.status(StatusCode.BAD_REQUEST.statusCode).json({
        status: false,
        error: error.message,
        message: error.message || StatusCode.BAD_REQUEST.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.extraService.remove(+id);
      res.status(StatusCode.NO_CONTENT.statusCode).json({
        status: true,
        message: StatusCode.NO_CONTENT.message,
      });
    } catch (error) {
      return res.status(StatusCode.BAD_REQUEST.statusCode).json({
        status: false,
        error: error.message,
        message: error.message || StatusCode.BAD_REQUEST.message,
      });
    }
  }
}
