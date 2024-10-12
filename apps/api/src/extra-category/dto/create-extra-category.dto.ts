import { IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Image } from '../../image/entities/image.entity';

export class CreateExtraCategoryDto {
    @IsOptional()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))
    id?: number;

    @IsNotEmpty({ message: 'İsim alanı boş olamaz.' })
    name: string;

    @IsNotEmpty({ message: 'Açıklama alanı boş olamaz.' })
    @IsString()
    description: string;

    @IsOptional()
    image?: Image;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))
    image_id?: number;

    @IsOptional()
    imageObj?: { 
        id: Image['id']; 
        file: MemoryStoredFile 
    };

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))
    order?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === '1')
    passive?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === '1')
    deleted?: boolean;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    created_at?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    updated_at?: Date;
}
