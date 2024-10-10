import React, { useState, useRef, useCallback, useMemo } from 'react';
import { DraggableListProps } from '../drag-drop.props';

const DraggableList = <T extends {}>({
    items = [],
    className = '',
    children,
    render,
    setItems,
    property = 'both',
}: DraggableListProps<T>) => {
    const [draggedItem, setDraggedItem] = useState<{
        index: number;
        item: T;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
        width?: number;
        height?: number;
    } | null>(null);

    const [isHolding, setIsHolding] = useState<boolean>(false);
    const [holdTimer, setHoldTimer] = useState<number | null>(null);
    const [animationTimer, setAnimationTimer] = useState<number | null>(null);
    const [holdingIndex, setHoldingIndex] = useState<number | null>(null);

    const [startTouch, setStartTouch] = useState<{ x: number; y: number } | null>(null);
    const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const moveThreshold = 5;

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>, index: number) => {
        e.stopPropagation();

        const touch = e.touches[0];
        const item = itemRefs.current[index];

        if (item) {
            const rect = item.getBoundingClientRect();
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - item.offsetTop;

            setStartTouch({ x: touch.clientX, y: touch.clientY });
            setLastTouch({ x: touch.clientX, y: touch.clientY });

            const animationTimer = window.setTimeout(() => {
                setHoldingIndex(index);
            }, 100);

            setAnimationTimer(animationTimer);

            const timer = window.setTimeout(() => {
                setIsHolding(true);
                setDraggedItem({
                    index,
                    item: items[index],
                    x: touch.clientX,
                    y: touch.clientY,
                    offsetX,
                    offsetY,
                    width: rect.width,
                    height: rect.height,
                });
            }, 400);

            setHoldTimer(timer);
        }
    }, [items]);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        if (lastTouch) {
            const deltaX = currentX - lastTouch.x;
            const deltaY = currentY - lastTouch.y;

            setLastTouch({ x: currentX, y: currentY });

            if (!isHolding) {
                if (holdTimer && startTouch) {
                    const totalDeltaX = Math.abs(currentX - startTouch.x);
                    const totalDeltaY = Math.abs(currentY - startTouch.y);
                    if (totalDeltaX > moveThreshold || totalDeltaY > moveThreshold) {
                        clearTimeout(holdTimer);
                        setHoldTimer(null);

                        if (animationTimer) {
                            clearTimeout(animationTimer);
                            setAnimationTimer(null);
                        }
                    }
                }

                if (holdingIndex !== null) {
                    setHoldingIndex(null);
                }

                const container = containerRef.current;
                if (container) {
                    (property === 'vertical' || property === 'both') && (container.scrollTop -= deltaY);
                    (property === 'horizontal' || property === 'both') && (container.scrollLeft -= deltaX);
                }

                return;
            }
        }

        if (isHolding && draggedItem) {
            setDraggedItem((prevItem) => ({
                ...prevItem!,
                x: currentX,
                y: currentY,
            }));

            autoScrollContainer(currentX, currentY);

            const overIndex = getOverIndex(currentX, currentY);
            if (overIndex != null) {
                const newItems = [...items];
                setItems(newItems);
                setHoldingIndex(overIndex);
            }
        }
    }, [draggedItem, holdTimer, startTouch, isHolding, lastTouch, animationTimer, setItems, holdingIndex]);

    const handleTouchEnd = useCallback(() => {
        if (holdTimer) {
            clearTimeout(holdTimer);
            setHoldTimer(null);
        }

        if (animationTimer) {
            clearTimeout(animationTimer);
            setAnimationTimer(null);
        }

        setIsHolding(false);
        setDraggedItem(null);
        setStartTouch(null);
        setLastTouch(null);
        setHoldingIndex(null);
    }, [holdTimer, animationTimer]);

    const autoScrollContainer = useCallback((currentX: number, currentY: number) => {
        const container = containerRef.current;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const scrollThreshold = 60;
            const maxScrollSpeed = 20;

            if (property === 'vertical' || property === 'both') {
                const distanceToTop = currentY - containerRect.top;
                const distanceToBottom = containerRect.bottom - currentY;

                if (distanceToTop < scrollThreshold) {
                    const scrollSpeed = Math.max(
                        -maxScrollSpeed,
                        ((distanceToTop - scrollThreshold) / scrollThreshold) * maxScrollSpeed
                    );
                    container.scrollTop += scrollSpeed;
                } else if (distanceToBottom < scrollThreshold) {
                    const scrollSpeed = Math.min(
                        maxScrollSpeed,
                        ((scrollThreshold - distanceToBottom) / scrollThreshold) * maxScrollSpeed
                    );
                    container.scrollTop += scrollSpeed;
                }
            }
            if (property === 'horizontal' || property === 'both') {
                const distanceToLeft = currentX - containerRect.left;
                const distanceToRight = containerRect.right - currentX;

                if (distanceToLeft < scrollThreshold) {
                    const scrollSpeed = Math.max(
                        -maxScrollSpeed,
                        ((distanceToLeft - scrollThreshold) / scrollThreshold) * maxScrollSpeed
                    );
                    container.scrollLeft += scrollSpeed;
                } else if (distanceToRight < scrollThreshold) {
                    const scrollSpeed = Math.min(
                        maxScrollSpeed,
                        ((scrollThreshold - distanceToRight) / scrollThreshold) * maxScrollSpeed
                    );
                    container.scrollLeft += scrollSpeed;
                }
            }
        }
    }, [property]);

    const getOverIndex = useCallback((x: number, y: number): number | null => {
        for (let i = 0; i < itemRefs.current.length; i++) {
            const item = itemRefs.current[i];
            if (item) {
                const rect = item.getBoundingClientRect();
                if(property === 'horizontal' || property === 'both') {
                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                        return i;
                    }
                }
                if(property === 'vertical' || property === 'both') {
                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                        return i;
                    }
                }
            }
        }
        return null;
    }, [draggedItem]);

    const memoizedItems = useMemo(() => {
        return items.map((item, index) => {
            const isDragged = draggedItem?.index === index ? 'dragged' : '';
            const hover = holdingIndex != null && draggedItem != null && (
                draggedItem?.index > index 
                    ? (holdingIndex <= index ? 'hover-down' : '') 
                    : (holdingIndex >= index ? 'hover-up' : '')
                ) || '';
                    
            const className = `draggable-item ${isDragged} ${hover}`;

            return (
                <div
                    key={index}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={className}
                >
                    {render(item, index)}
                </div>
            )
        });
    }, [items, handleTouchStart, handleTouchMove, handleTouchEnd, holdingIndex, draggedItem, render]);

    return (
        <div
            className={`scrollable-draggable-list ${property} ${className}`}
            ref={containerRef}
            style={{ touchAction: 'none' }}
        >
            {memoizedItems}
            {children && (
                <div className="draggable-item">{children}</div>
            )}
            {draggedItem && isHolding && (
                <div
                    className="draggable-item dragged-clone"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: draggedItem.width,
                        height: draggedItem.height,
                        transform: `translate(${draggedItem.x - draggedItem.offsetX}px, ${draggedItem.y - draggedItem.offsetY}px)`,
                        pointerEvents: 'none',
                    }}
                >
                    {render(draggedItem.item, draggedItem.index)}
                </div>
            )}
        </div>
    );
};

export default DraggableList;
