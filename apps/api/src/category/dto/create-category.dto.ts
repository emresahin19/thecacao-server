export class CreateCategoryDto {
    id?: number;
    name?: string;
    slug?: string;
    color?: string;
    textColor?: string;
    order?: number;
    passive?: boolean;
    deleted?: boolean;
}