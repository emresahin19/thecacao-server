export class CreateProductDto {
    name?: string;
    slug?: string;
    price?: number;
    recipe?: string;
    description?: string;
    imageIds?: string[];
    extra?: string[];
    diy?: string[];
    order?: number;
    passive?: boolean;
    deleted?: boolean;
    categoryId: number;
  }
  