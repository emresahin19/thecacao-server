export class CreateCategoryDto {
    type?: string;
    priority: number;
    title: string;
    description?: string;
    slug: string;
    showAtHome: boolean;
    showAtMenu: boolean;
    order: number;
    passive: boolean;
    deleted: boolean;
    tags: string[];
    keywords: string[];
}
