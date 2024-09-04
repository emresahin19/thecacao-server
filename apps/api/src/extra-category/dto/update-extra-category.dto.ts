import { PartialType } from '@nestjs/mapped-types';
import { CreateExtraCategoryDto } from './create-extra-category.dto';

export class UpdateExtraCategoryDto extends PartialType(CreateExtraCategoryDto) {}
