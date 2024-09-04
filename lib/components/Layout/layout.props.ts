export interface SidebarItemProps {
    label: string
    icon?: string
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
    open: boolean;
    onChange?: (open: boolean) => void;
    onClose?: () => void;
}
