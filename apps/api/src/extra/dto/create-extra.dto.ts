import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ManyToOne } from 'typeorm';
import { ExtraCategory } from '../../extra-category/entities/extra-category.entity';
import { Image } from '../../image/entities/image.entity';

export class CreateExtraDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  id?: number;

  @IsNotEmpty({ message: 'Kategori boş olamaz.' })
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  category_id: number;

  @IsNotEmpty({ message: 'Ekstra adı boş olamaz.' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value))
  price?: number;

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

  @IsOptional()
  @ManyToOne(() => ExtraCategory, (category) => category.extras)
  category?: ExtraCategory;
}
