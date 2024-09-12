import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
    private readonly uploadPath = path.join(__dirname, '../../uploads');

    async saveImage(file: Express.Multer.File) {
        const filePath = path.join(this.uploadPath, file.filename);
        await fs.writeFile(filePath, file.buffer);
        return filePath;
    }

    async resizeImage(filePath: string, width: number, height: number): Promise<Buffer> {
        const outputBuffer = await sharp(filePath)
        .resize(width, height)
        .toBuffer();
        return outputBuffer;
    }
}
