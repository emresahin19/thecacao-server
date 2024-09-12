"use client";
import type { CarouselProps } from '../carousel.props';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import BackToStart from './back-to-start.component';
import { carouselLengthOnScreen, slideWidthDefault } from '@asim-ui/constants';
import { sleep } from '@asim-ui/utils';

const cdnUrl = 'https://cdn.asimthecat.com';

const Carousel: React.FC<CarouselProps> = ({ 
    items, 
    arrows = false, 
    viewType = 'carousel',
    dots = false, 
    slideWidth = slideWidthDefault,
    infinite = false,
    backToStartColor,
    columnItemsCount = 1,
    rowItemsCount = carouselLengthOnScreen,
    initialStart = false,
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [touchMoved, setTouchMoved] = useState<boolean>(false);
    const [isVerticalScroll, setIsVerticalScroll] = useState<boolean>(false);
    const [isTouchActive, setIsTouchActive] = useState<boolean>(true);
    const [endMessageOpacity, setEndMessageOpacity] = useState(0);
    const [cloneItems, setCloneItems] = useState<React.ReactNode[]>([]);
    const [swipeTransition, setSwipeTransition] = useState<boolean>(false);
    const initialSwipe = useRef(false);
    const touchStartTimeRef = useRef<number>(0); 

    const carouselRef = useRef<HTMLDivElement>(null);
    const transitionDuration = 300;
    const touchThreshold = 10;

    const touchStartXRef = useRef(0);
    const touchStartYRef = useRef(0);
    
    const nextSlide = (index: number) => {
        if (viewType != 'carousel' || items.length < rowItemsCount || isVerticalScroll) return;
        
        const itemCount = infinite ? cloneItems.length : items.length;
        const realIndex = index >= itemCount - (rowItemsCount - 1) ? itemCount - (rowItemsCount) : index;

        setIsTransitioning(true);
        setCurrentIndex(realIndex);
        setTimeout(() => {
            if (infinite && index >= items.length + rowItemsCount) {
                setCurrentIndex(rowItemsCount);
            }
            setIsTransitioning(false);
        }, transitionDuration);
    };

    const prevSlide = (index: number) => {
        if (viewType != 'carousel' || items.length < rowItemsCount || isVerticalScroll) return;

        const realIndex = index < 0 ? 0 : index;
        setIsTransitioning(true);
        setCurrentIndex(realIndex);
        setTimeout(() => {
            if (infinite && realIndex < rowItemsCount) {
                setCurrentIndex(items.length + rowItemsCount - 1);
            }
            setIsTransitioning(false);
        }, transitionDuration);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        if (viewType != 'carousel' || items.length < rowItemsCount) return;
        
        touchStartTimeRef.current = Date.now();
        const touchStartX = e.touches[0].clientX;
        const touchStartY = e.touches[0].clientY;
        touchStartXRef.current = touchStartX;
        touchStartYRef.current = touchStartY;
        if (carouselRef.current) {
            carouselRef.current.style.transition = 'none';
        }
        setTouchMoved(false);
        setIsVerticalScroll(false);
        setIsTouchActive(true);
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        e.stopPropagation();
        if (viewType != 'carousel' || items.length < rowItemsCount || isVerticalScroll) return;

        const touchStartX = touchStartXRef.current;
        const touchStartY = touchStartYRef.current;
        const touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        const touchDeltaX = touchCurrentX - touchStartX;
        const touchDeltaY = touchCurrentY - touchStartY;

        if (!touchMoved) {
            if (Math.abs(touchDeltaY) > Math.abs(touchDeltaX)) {
                setIsVerticalScroll(true);
                return;
            } else if (Math.abs(touchDeltaX) > touchThreshold) {
                setTouchMoved(true);
            }
        } else {
            e.preventDefault();
        }

        let translateX = touchDeltaX;

        if(infinite){
            translateX = touchDeltaX;
        } else if ((currentIndex === 0 && touchDeltaX > 0)) {
            translateX = Math.sign(touchDeltaX) * (Math.abs(touchDeltaX) * 0.3);
        } else if ((currentIndex === items.length - rowItemsCount && touchDeltaX < 0)) {
            const extraMove = Math.abs(Math.sign(touchDeltaX) * (Math.abs(touchDeltaX) * 0.3));
            setEndMessageOpacity(Math.min(extraMove / slideWidth, 1));
            translateX = -Math.min(slideWidth, extraMove);
        }

        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(${translateX}px)`;
        }

    }, [currentIndex, items.length, touchMoved, rowItemsCount, viewType, infinite, slideWidth]);

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation();
        if (viewType !== 'carousel' || isVerticalScroll) return;
    
        const touchEndTime = Date.now();
        const touchStartX = touchStartXRef.current;
        const touchEndX = e.changedTouches[0].clientX;
        const touchDeltaX = touchEndX - touchStartX;
    
        const touchDuration = touchEndTime - touchStartTimeRef.current;
        const velocity = Math.abs(touchDeltaX) / touchDuration;
        
        const moveFactor = Math.max(Math.floor(velocity), 0);
        const slidable = Math.abs(touchDeltaX) > slideWidth;

        if (carouselRef.current) {
            carouselRef.current.style.transition = `transform ${transitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
            carouselRef.current.style.transform = 'translateX(0)';
        }

        if(!slidable) return;
    
        if (infinite) {
            if (touchDeltaX > 0) {
                const index = currentIndex - moveFactor;
                prevSlide(index);
            } else if (touchDeltaX < 0) {
                const index = currentIndex + moveFactor;
                nextSlide(index);
            }
        } else {
            if (touchDeltaX > 0) {
                const index = currentIndex - moveFactor;
                prevSlide(index - 1);
            } else if (touchDeltaX < 0) {
                const extraMove = Math.abs(touchDeltaX * 0.3);
                const isLastSlide = currentIndex === items.length - rowItemsCount && extraMove >= slideWidth;
    
                if (isLastSlide) {
                    setCurrentIndex(0);
                    setEndMessageOpacity(0);
                } else {
                    const index = currentIndex + moveFactor;
                    nextSlide(index + 1);
                }
            }
        }
    
        setIsTouchActive(false);
    };
    

    useEffect(() => {
        if (viewType) 
            setCurrentIndex(0);
    }, [viewType]);

    useEffect(() => {
        const handleResize = () => {
            setCurrentIndex(currentIndex => currentIndex);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (infinite) {
            const clonesBefore = items.slice(-rowItemsCount);
            const clonesAfter = items.slice(0, rowItemsCount);
            setCloneItems([...clonesBefore, ...items, ...clonesAfter]);
            setCurrentIndex(rowItemsCount);
        } 
    }, [items, infinite, rowItemsCount]);

    useEffect(() => {
        const node = carouselRef.current;
        if (node) {
            node.addEventListener('touchmove', handleTouchMove, { passive: false });
        }
        return () => {
            if (node) {
                node.removeEventListener('touchmove', handleTouchMove);
            }
        };
    }, [handleTouchMove]);

    useEffect(() => {
        const startAnimation = async () => {
            if(!initialStart || !carouselRef.current || viewType !== 'carousel') return;
            await sleep(1000);
            setSwipeTransition(true);
            await sleep(400);
            if (!initialSwipe.current && carouselRef.current) {
                initialSwipe.current = true;
                carouselRef.current.style.transition = `transform 400ms ease-in, transform 400ms ease-out 200ms`;
                carouselRef.current.style.transform = `translateX(-${slideWidth}px)`;

                await sleep(400);
                if (carouselRef.current) {
                    carouselRef.current.style.transform = `translateX(0)`;
                }
                await sleep(800);
                setSwipeTransition(false);
            }
        };

        startAnimation();
    }, [initialStart, slideWidth]);

    const handleTouchStartWrapper = (e: React.TouchEvent) => {
        e.stopPropagation();
        handleTouchStart(e);
    };

    const handleTouchEndWrapper = (e: React.TouchEvent) => {
        e.stopPropagation();
        handleTouchEnd(e);
    };

    const handleCurrentIndex = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentIndex(index);
    };

    return (
        <div className={`carousel ${viewType}`}>
            {arrows && viewType === 'carousel' && 
                <button 
                    className="carousel-button prev" 
                    role="button" 
                    onClick={() => prevSlide(currentIndex - 1)} 
                    aria-label={`Önceki Resim`}
                >
                    {'<'}
                </button>
            }
            <div
                className="carousel-wrapper"
                onTouchStart={handleTouchStartWrapper}
                onTouchEnd={handleTouchEndWrapper}
                ref={carouselRef}
            >
                <div 
                    className="carousel-inner" 
                    style={{
                        transform: `translateX(-${viewType !== 'carousel' || items.length < rowItemsCount ? 0 : (currentIndex * 100) / rowItemsCount}%)`,
                        transition: isTransitioning ? `transform ${transitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none',
                        flexWrap: viewType === 'carousel' ? 'nowrap' : 'wrap',
                        willChange: isTouchActive ? 'transform' : 'auto', 
                    }}
                >
                    {
                        infinite ? (
                            cloneItems.map((item, index) => (
                                <div 
                                    className={`carousel-item carousel-${viewType === 'list' ? 1 : rowItemsCount}-item ${currentIndex === index ? 'active' : ''}`} 
                                    key={index} 
                                >
                                    {item}
                                </div>
                            ))
                        ) : (
                            items.map((item, index) => (
                                <div 
                                    className={`carousel-item carousel-${viewType === 'list' ? 1 : rowItemsCount}-item ${currentIndex === index ? 'active' : ''}`} 
                                    key={index} 
                                >
                                    {item}
                                </div>
                            ))
                        )
                    }
                    {!infinite && currentIndex === items.length - rowItemsCount && (
                        <div className="carousel-end" style={{maxWidth: slideWidth === slideWidthDefault ? '20%' : `${slideWidth}px` }}>
                            <BackToStart rotate={endMessageOpacity} color={backToStartColor} />
                        </div>
                    )}
                </div>
            </div>
            {arrows && viewType === 'carousel' && 
                <button 
                    className="carousel-button next" 
                    role="button" 
                    onClick={() => nextSlide(currentIndex + 1)} 
                    aria-label={`Sonraki Resim`}
                >
                    {'>'}
                </button>
            }
            {
                swipeTransition && (
                    <div className="swipe-transition-hand">
                        <div className="path"></div>
                        <div className="hand-icon" style={{backgroundImage: `url(${cdnUrl}/media/image/swipe-hand.png)`}}></div>
                    </div>
                )
            }
            {dots && viewType === 'carousel' && (
                <div className='counter'>
                    {Array.from({ length: items.length - (rowItemsCount - 1) }, (_, i) => (
                        <a
                            key={i} 
                            className={`dot ${(currentIndex % items.length) === i ? 'active' : ''}`}
                            onClick={e => handleCurrentIndex(e, i)}
                            role='button'
                            aria-label={`Resim ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
