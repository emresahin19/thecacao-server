export class CreateNewsDto {
    title: string;
    slug: string;
    content: string;
    publishedDate: Date;
    authorId: number;
    categoryId: number;
    imagePath?: string;
    featuredImageUrl?: string;
    videoPath?: string;
    featuredVideoUrl?: string;
    relatedNewsIds?: number[];
    tags?: string[];
    keywords?: string[];
    wordCount?: number;
    showAuthor?: boolean;
    hit?: number;
    shared?: Record<string, number>;
    noComments?: boolean;
    noAds?: boolean;
    hidden?: boolean;
    hiddenHomepage?: boolean;
    passive?: boolean;
    deleted?: boolean;
}
