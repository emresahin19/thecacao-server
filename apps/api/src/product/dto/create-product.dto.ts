import { Image } from "../../image/entities/image.entity";

export class CreateProductDto {
    name?: string;
    slug?: string;
    price?: number;
    recipe?: string;
    description?: string;
    image_ids?: number[];
    images?: Image[];
    extra?: number[];
    diy?: string[];
    order?: number;
    passive?: boolean;
    deleted?: boolean;
    category_id: number;
  }
  