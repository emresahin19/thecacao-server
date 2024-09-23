export class CreateProductDto {
    name?: string;
    slug?: string;
    price?: number;
    recipe?: string;
    description?: string;
    image_ids?: number[];
    extra?: number[];
    diy?: string[];
    order?: number;
    passive?: boolean;
    deleted?: boolean;
    category_id?: number;
  }
  