import { Controller, Get, Post, Body, Put, Param, Delete, Query, Res } from '@nestjs/common';
import { ExtraCategoryService } from './extra-category.service';
import { CreateExtraCategoryDto } from './dto/create-extra-category.dto';
import { UpdateExtraCategoryDto } from './dto/update-extra-category.dto';
import { StatusCode } from '../common/constants';
import { ExtraCategoryQueryParams } from './extra-category.props';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('extra-categories')
export class ExtraCategoryController {
    constructor(private readonly extraCategoryService: ExtraCategoryService) {}

    @Post()
    @FormDataRequest()
    async create(@Body() createExtraCategoryDto: CreateExtraCategoryDto, @Res() res: Response) {
        try {
            const item = await this.extraCategoryService.create(createExtraCategoryDto);

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
                message: StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Put(':id')
    @FormDataRequest()
    async update(@Param('id') id: string, @Body() updateExtraCategoryDto: UpdateExtraCategoryDto, @Res() res: Response) {
        try {
            const item = await this.extraCategoryService.update(+id, updateExtraCategoryDto);

            return item
                ? res.status(StatusCode.SUCCESS.statusCode).json({
                      status: true,
                      message: StatusCode.SUCCESS.message,
                  })
                : res.status(StatusCode.BAD_REQUEST.statusCode).json({
                      status: false,
                      message: StatusCode.BAD_REQUEST.message,
                  });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.message,
                message: StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Get()
    async index(@Query() params: ExtraCategoryQueryParams, @Res() res: Response) {
        try {
            const items = await this.extraCategoryService.findAll(params);

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
                message: StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Get(':id')
    async getExtraCategory(@Param('id') id: number, @Res() res: Response) {
        try {
            const item = await this.extraCategoryService.getExtraCategoryWithImage(id);

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
                message: StatusCode.BAD_REQUEST.message,
            });
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.extraCategoryService.remove(+id);
            res.status(StatusCode.NO_CONTENT.statusCode).json({
                status: true,
                message: StatusCode.NO_CONTENT.message,
            });
        } catch (error) {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                status: false,
                error: error.message,
                message: StatusCode.BAD_REQUEST.message,
            });
        }
    }
}
