import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { MemoryStoredFile } from 'nestjs-form-data';

export class CreateProductDto {
    @IsOptional()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))
    id?: number;
    
    @IsNotEmpty({ message: 'Kategori boş olamaz.' })
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10))  
    category_id: number;

    @IsNotEmpty({ message: 'Ürün adı boş olamaz.' })
    name: string;

    @IsNotEmpty({ message: 'Fiyat boş olamaz.' })
    @Type(() => Number)
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsOptional()
    @IsString()
    recipe?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (!value) return [];
        if (Array.isArray(value)) return value.map(Number);
        try {
            return JSON.parse(value).map(Number); 
        } catch (error) {
            throw new BadRequestException('image_ids geçersiz formatta.');
        }
    })
    image_ids?: number[];

    @IsOptional()
    @IsArray()
    files?: { id?: number; file?: MemoryStoredFile, fieldname?: string }[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (!value) return [];
        if (Array.isArray(value)) return value.map(Number);
        try {
            return JSON.parse(value).map(Number);
        } catch (error) {
            throw new BadRequestException('extra geçersiz formatta.');
        }
    })
    extra?: number[];

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
    @Transform(({ value }) => value ? new Date(value) : new Date())
    created_at?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : new Date())
    updated_at?: Date;

}
