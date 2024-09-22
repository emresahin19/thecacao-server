import React, { useEffect, useRef, useState, TouchEvent, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from 'lib/store/modal.slice';
import { RootState } from 'lib/store';
import ProductDetailCard from "lib/components/Card/components/product-detail-card.component";
import ProductEditCard from "lib/components/Card/components/product-edit-card.component";
import CategoryEditCard from "lib/components/Card/components/category-edit-card.component";
import DeleteModal from "./delete-modal.component"
import Logo from "lib/components/Logo/components/logo.component";
import { ModalInitialProps } from "../modal.props";

const modalTop = 0;

const Modal: React.FC<ModalInitialProps> = ({ onClose, initialData }) => {
    const dispatch = useDispatch();
    const modalRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef<number>(0);
    const startYRef = useRef<number>(0); // Changed to useRef for better performance
    const moveYRef = useRef<number>(0); // Changed to useRef for better performance
    const [isInitialDataUsed, setIsInitialDataUsed] = useState<boolean>(!!initialData);

    // If initialData exists, use it only once, then fall back to Redux store
    const modalState = useSelector((state: RootState) => state.modal);
    const { show, component, data } = isInitialDataUsed && initialData ? initialData : modalState;

    // Modal open logic
    const handleOpen = useCallback(() => {
        const wrapper = document.body;
        if (wrapper) {
            scrollYRef.current = window.scrollY || window.pageYOffset;
            wrapper.style.top = `-${scrollYRef.current}px`;
            wrapper.classList.add('overflow-disabled');
        }
        moveYRef.current = 0;
        if (modalRef.current) {
            modalRef.current.style.transform = `translateY(${modalTop}px) scale(1)`;
            modalRef.current.style.transition = 'transform 0.3s ease';
        }
    }, []);

    // Modal close logic
    const handleClose = useCallback(() => {
        if (initialData) setIsInitialDataUsed(false);
        dispatch(closeModal());
        onClose && onClose();
        const wrapper = document.body;
        if (wrapper) {
            wrapper.classList.remove('overflow-disabled');
            wrapper.style.top = '';
            window.scrollTo(0, scrollYRef.current);
        }
        if (modalRef.current) {
            modalRef.current.style.transform = `translateY(calc(100% + ${modalTop}px)) scale(0.85)`;
            modalRef.current.style.transition = 'transform 0.3s ease';
        }
    }, [initialData, onClose, dispatch]);

    // Open or close modal based on 'show' state
    useEffect(() => {
        if (show) {
            handleOpen();
        } else {
            handleClose();
        }
    }, [show]);

    // Handle touch start event
    const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const currentY = Math.min(moveYRef.current, 0);
        const clientY = e.touches[0].clientY;
        startYRef.current = clientY - currentY;
        if (modalRef.current) {
            modalRef.current.style.transition = 'none';
            modalRef.current.style.overflow = 'hidden';
        }
    }, []);

    // Handle touch move event
    const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const modalHeight = modalRef.current!.offsetHeight;
        const currentY = e.touches[0].clientY;
        const windowH = window.innerHeight;
        const maxMoveY = windowH - modalHeight - modalTop;
        const diffY = Math.max(currentY - startYRef.current, maxMoveY);

        if (diffY < maxMoveY) return;

        moveYRef.current = diffY;

        if (diffY >= 0) {
            const scale = 1 - Math.min(diffY / window.innerHeight, 0.15);
            modalRef.current!.style.transform = `translateY(${modalTop}px) scale(${scale})`;

            if (scale <= 0.85) {
                const adjustedDiffY = diffY - (windowH * 0.15);
                modalRef.current!.style.transform = `translateY(${adjustedDiffY}px) scale(0.85)`;
            }
        } else if (diffY < 0) {
            modalRef.current!.style.transform = `translateY(${diffY}px) scale(1)`;
        }
    }, []);

    // Handle touch end event
    const handleTouchEnd = useCallback(() => {
        const modalHeight = modalRef.current!.offsetHeight;
        const maxMoveY = window.innerHeight - modalHeight - modalTop;
        const diffY = Math.max(moveYRef.current, maxMoveY);
        const limit = Math.min(window.innerHeight / 5, window.innerHeight * 0.85);

        if (diffY >= 0) {
            if (moveYRef.current > limit) {
                handleClose();
            } else {
                if (modalRef.current) {
                    modalRef.current.style.transform = `translateY(${modalTop}px) scale(1)`;
                    modalRef.current.style.transition = 'transform 0.3s ease';
                    modalRef.current.style.overflow = '';
                }
            }
        } else {
            if (modalRef.current) {
                modalRef.current.style.transform = `translateY(${diffY}px) scale(1)`;
                modalRef.current.style.transition = 'transform 0.3s ease';
                modalRef.current.style.overflow = '';
            }
        }
    }, [handleClose]);

    return (
        <div className={`modal-container ${show && 'show' || ''}`}>
            {show && (
                <div
                    className="modal"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    ref={modalRef}
                >
                    <div className="modal-header">
                        <Logo width={60} homePath="/menu" />
                        <button
                            className="close"
                            onClick={handleClose}
                            role="button"
                            aria-label="Pencereyi Kapat"
                        >
                            Kapat
                        </button>
                    </div>
                    <div className="modal-body">
                        {component === 'ProductDetailCard' && data && <ProductDetailCard {...data} />}
                        {component === 'ProductEditCard' && data && <ProductEditCard {...data} />}
                        {component === 'CategoryEditCard' && data && <CategoryEditCard {...data} />}
                        {component === 'DeleteModal' && data && <DeleteModal {...data} />}
                    </div>
                </div>
            )}
        </div>
    );
};

// Memoize the Modal component to prevent unnecessary re-renders
export default React.memo(Modal);
