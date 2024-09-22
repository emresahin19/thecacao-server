export class CreateExtraDto {
    name?: string;
    description?: string;
    category_id?: number;
    price?: number;
    image?: string;
    passive?: boolean;
    deleted?: boolean;
}