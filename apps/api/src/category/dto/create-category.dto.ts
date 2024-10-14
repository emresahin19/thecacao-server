import { IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty, IsDate, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { Product } from '../../product/entities/product.entity';

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
    style?: object;

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

    @IsOptional()
    @IsArray()
    @Transform(({ value }: { value: Product[] }) => {
        try {
            return value && value.map((item: Product, index: number) => ({id: item.id, order: index})) || [];
        } catch (error) {
            throw new BadRequestException('Geçersiz JSON formatı');
        }
    })
    products?: { id: number, order: number }[];
}
