import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Query,
    Res,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
        @Post('upload')
        @UseInterceptors(FileInterceptor('file'))
        async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const savedPath = await this.mediaService.saveImage(file);
        return { path: savedPath };
    }

    @Post('resize')
    async resizeImage(
        @Query('filename') filename: string,
        @Query('width') width: number,
        @Query('height') height: number,
        @Res() res: Response,
    ) {
        const filePath = path.join(__dirname, '../../uploads', filename);
        const resizedImage = await this.mediaService.resizeImage(filePath, +width, +height);
        res.set('Content-Type', 'image/jpeg');
        res.send(resizedImage);
    }
}
