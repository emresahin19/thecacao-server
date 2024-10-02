import { IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class CreateCategoryDto {
    @IsOptional()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))
    id?: number;

    @IsNotEmpty({ message: 'Kategori adı boş olamaz.' })
    name: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))
    order?: number;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    textColor?: string;

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
    @Transform(({ value }) => value ? new Date(value) : new Date())
    created_at?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : new Date())
    updated_at?: Date;
}
