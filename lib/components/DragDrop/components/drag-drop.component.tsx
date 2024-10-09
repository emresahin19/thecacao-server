import React, { useState, useRef } from 'react';
import { DraggableListProps } from '../drag-drop.props';
function DraggableList<T>({ items = [], className = '', children, render, setItems }: DraggableListProps<T>) {
    const [draggedItem, setDraggedItem] = useState<{
        index: number;
        item: T;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
    } | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
        e.stopPropagation();
        const touch = e.touches[0];
        const item = itemRefs.current[index];
        if (item) {
            const rect = item.getBoundingClientRect();
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - item.offsetTop;
            setDraggedItem({
                index,
                item: items[index],
                x: touch.clientX,
                y: touch.clientY,
                offsetX,
                offsetY,
            });
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!draggedItem) return;
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        setDraggedItem({
            ...draggedItem,
            x: currentX,
            y: currentY,
        });
        const overIndex = getOverIndex(currentX, currentY);
        if (overIndex !== null && overIndex !== draggedItem.index) {
            const newItems = [...items];
            const [removedItem] = newItems.splice(draggedItem.index, 1);
            newItems.splice(overIndex, 0, removedItem);
            setItems(newItems);
            setDraggedItem({
                ...draggedItem,
                index: overIndex,
            });
        }
    };

    const handleTouchEnd = () => {
        setDraggedItem(null);
    };

    const getOverIndex = (x: number, y: number): number | null => {
        for (let i = 0; i < itemRefs.current.length; i++) {
            const item = itemRefs.current[i];
            if (item && i !== draggedItem?.index) {
                const rect = item.getBoundingClientRect();
                if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                    return i;
                }
            }
        }
        return null;
    };

    return (
        <div className={`draggable-list ${className}`}>
            {items.length > 0 && items.map((item, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="draggable-item"
                >
                    {render(item, index)}
                </div>
            ))}
            {children && (
                <div className="draggable-item">{children}</div>
            )}
            {draggedItem && (
                <div
                    className="draggable-item dragged-clone"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: `translate(${draggedItem.x - draggedItem.offsetX}px, ${draggedItem.y - draggedItem.offsetY}px)`,
                        pointerEvents: 'none',
                    }}
                >
                    {render(draggedItem.item, draggedItem.index)}
                </div>
            )}
        </div>
    )
}
export default DraggableList;