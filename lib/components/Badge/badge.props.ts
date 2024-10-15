export interface BadgeProps {
    color?: 'danger' | 'success' | 'warning' | 'info' | 'primary' | 'secondary' | 'dark' | 'light';
    children?: React.ReactNode;
    onRemove?: () => void;
}
export interface CountBadgeProps extends BadgeProps {
    count: number;
}
