export interface SidebarItemProps {
    label: string
    icon?: React.ReactNode
    href?: string
    target?: string
    isLogout?: boolean
    menu?: SidebarItemProps[]
    onClick?: () => void
    children?: SidebarItemProps[]
}

export interface MenuNavBarItem {
    label?: string
    icon?: string
    href?: string
    target?: string
    isDivider?: boolean
    isLogout?: boolean
    isDesktopNoLabel?: boolean
    isToggleLightDark?: boolean
    isCurrentUser?: boolean
    menu?: MenuNavBarItem[]
}

export interface SidebarProps {
    open?: boolean;
    onChange?: (open: boolean) => void;
    onClose?: () => void;
}

export interface CategoryCarouselItemProps {
    id: number;
    name: string;
    isActive?: boolean;
}

export interface CategoryCarouselProps {
    data: CategoryCarouselItemProps[];
    activeCategory?: number | null;
}

export interface MetaDataProps {
    name: string;
    category: string;
    description: string;
    image: string | null | undefined;
    src?: string;
    slug: string;
    price?: number;
    availability?: boolean;
}