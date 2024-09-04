
export interface CarouselProps {
    items: React.ReactNode[];
    arrows?: boolean;
    grid?: boolean;
    viewType?: 'grid' | 'list' | 'carousel';
    rowItemsCount?: number;
    indexChange?: (index: number) => void;
    dots?: boolean;
    slideWidth?: number;
    infinite?: boolean;
    backToStartColor?: string;
    columnItemsCount?: number;
    initialStart?: boolean;
}

export interface CarouselBackToStartProps {
    rotate: number;
    color?: string;
}

