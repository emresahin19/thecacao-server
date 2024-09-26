import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    category_id?: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number) 
    price?: number;

    @IsOptional()
    @IsString()
    recipe?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(',').map(Number))
    image_ids?: number[];

    @IsOptional()
    @IsArray()
    files?: { id?: number; file?: Express.Multer.File }[];

    @IsOptional()
    @IsArray()
    fileMap?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(',').map(Number))
    extra?: number[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(',')) 
    diy?: string[];

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    order?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    passive?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    deleted?: boolean;
}
