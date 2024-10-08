export interface DraggableListProps<T> {
    items: T[];
    className?: string;
    render: (item: T, index: number) => React.ReactNode;
    setItems: (newItems: T[]) => void;
    children?: React.ReactNode;
}