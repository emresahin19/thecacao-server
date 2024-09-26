import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateImageDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @IsOptional()
    @IsString()
    cf_id?: string;

    @IsOptional()
    @IsString()
    filename?: string;

    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsString()
    variant?: string;

    
}