import React, { useState, useRef } from 'react';
import { DraggableListProps } from '../drag-drop.props';

const DraggableList =  <T extends { }>({ items, className, render, setItems }: DraggableListProps<T>) => {
    const [draggedItem, setDraggedItem] = useState<{
        index: number;
        item: T;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
    } | null>(null);

    const [isHolding, setIsHolding] = useState<boolean>(false);
    const [holdTimer, setHoldTimer] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [startTouch, setStartTouch] = useState<{ x: number; y: number } | null>(null);
    const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const moveThreshold = 5; // pixels

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
        e.stopPropagation();

        const touch = e.touches[0];
        const item = itemRefs.current[index];

        if (item) {
            const rect = item.getBoundingClientRect();
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;

            setStartTouch({ x: touch.clientX, y: touch.clientY });
            setLastTouch({ x: touch.clientX, y: touch.clientY });

            // Start the timer for 0.5 seconds to initiate the drag
            const timer = window.setTimeout(() => {
                setIsHolding(true);
                setDraggedItem({
                    index,
                    item: items[index],
                    x: touch.clientX,
                    y: touch.clientY,
                    offsetX,
                    offsetY,
                });

                // Once dragging starts, set isDragging to true
                setIsDragging(true);
            }, 500); // 500ms delay

            setHoldTimer(timer);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        if (lastTouch) {
            const deltaX = currentX - lastTouch.x;
            const deltaY = currentY - lastTouch.y;

            // Update last touch position
            setLastTouch({ x: currentX, y: currentY });

            if (!isHolding) {
                // If the user moves before holding time, cancel the hold timer
                if (holdTimer && startTouch) {
                    const totalDeltaX = Math.abs(currentX - startTouch.x);
                    const totalDeltaY = Math.abs(currentY - startTouch.y);
                    if (totalDeltaX > moveThreshold || totalDeltaY > moveThreshold) {
                        clearTimeout(holdTimer);
                        setHoldTimer(null);
                    }
                }

                // Manually scroll the container
                const container = containerRef.current;
                if (container) {
                    container.scrollTop -= deltaY;
                }

                return; // Do not proceed further if not holding
            }
        }

        if (isHolding && draggedItem) {
            setDraggedItem({
                ...draggedItem,
                x: currentX,
                y: currentY,
            });

            autoScrollContainer(currentY);

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
        }
    };

    const handleTouchEnd = () => {
        // Cancel the hold timer if it hasn't triggered yet
        if (holdTimer) {
            clearTimeout(holdTimer);
            setHoldTimer(null);
        }

        // Reset hold state and dragged item
        setIsHolding(false);
        setDraggedItem(null);
        setIsDragging(false); // Reset dragging state

        // Reset touch positions
        setStartTouch(null);
        setLastTouch(null);
    };

    const autoScrollContainer = (currentY: number) => {
        const container = containerRef.current;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const scrollThreshold = 60; // Distance from edge to start scrolling
            const maxScrollSpeed = 20; // Max pixels to scroll per event

            const distanceToTop = currentY - containerRect.top;
            const distanceToBottom = containerRect.bottom - currentY;

            if (distanceToTop < scrollThreshold) {
                // Scroll up
                const scrollSpeed = Math.max(
                    -maxScrollSpeed,
                    ((distanceToTop - scrollThreshold) / scrollThreshold) * maxScrollSpeed
                );
                container.scrollTop += scrollSpeed;
            } else if (distanceToBottom < scrollThreshold) {
                // Scroll down
                const scrollSpeed = Math.min(
                    maxScrollSpeed,
                    ((scrollThreshold - distanceToBottom) / scrollThreshold) * maxScrollSpeed
                );
                container.scrollTop += scrollSpeed;
            }
        }
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
        <div
            className='draggable-list'
            ref={containerRef}
            style={{ touchAction: 'none' }} // Start with touch-action: none
        >
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
            {draggedItem && isHolding && (
                <div
                    className="draggable-item dragged-clone"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
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
