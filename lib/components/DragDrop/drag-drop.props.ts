export interface DraggableListProps<T> {
    items: T[];
    className?: string;
    renderItem: (item: T, index: number) => React.ReactNode;
    onChange: (newItems: T[]) => void;
}