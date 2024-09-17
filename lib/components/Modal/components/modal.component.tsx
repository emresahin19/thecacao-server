import type { ModalInitialProps } from "../modal.props";
import React, { useEffect, useRef, useState, TouchEvent } from "react";
import dynamic from "next/dynamic";
import { useModal } from "lib/contexts";

const Logo = dynamic(() => import("../../Logo/components/logo-image.component"), { ssr: false });

const modalTop = 0;

const Modal: React.FC<ModalInitialProps> = ({ blurrable = false }) => {
    const { show, component, resetModal } = useModal();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false); // Internal state to manage closing
    const [startY, setStartY] = useState<number>(0);
    const [moveY, setMoveY] = useState<number>(0);
    const scrollYRef = useRef<number>(0); // To store scroll position

    // Handle opening the modal
    const handleOpen = () => {
        setMoveY(0);
        const mainContent = document.getElementById('main');
        if (mainContent) {
            // Store the current scroll position
            scrollYRef.current = window.scrollY || window.pageYOffset;
            // Fix the mainContent div to prevent background scrolling
            mainContent.style.position = 'fixed';
            mainContent.style.top = `-${scrollYRef.current}px`;
            mainContent.style.left = '0';
            mainContent.style.right = '0';
            mainContent.style.overflow = 'hidden';
        }

        if (modalRef.current) {
            // Apply opening transformations
            modalRef.current.style.transform = `translateY(${modalTop}px) scale(1)`;
            modalRef.current.style.transition = 'transform 0.3s ease';
            if (blurrable) {
                modalRef.current.style.backdropFilter = `blur(${7}px)`;
            }
        }
    };

    // Handle initiating the closing process
    const initiateClose = () => {
        setIsClosing(true); // Start closing animation

        // Apply closing transformations
        if (modalRef.current) {
            modalRef.current.style.transform = `translateY(calc(100% + ${modalTop}px)) scale(0.85)`;
            modalRef.current.style.transition = 'transform 0.3s ease';
            if (blurrable) {
                modalRef.current.style.backdropFilter = `blur(${0}px)`;
            }
        }

        // After the animation duration, finalize the close
        setTimeout(() => {
            finalizeClose();
        }, 300); // Duration matches the CSS transition
    };

    // Finalize the closing process
    const finalizeClose = () => {
        setIsClosing(false); // Reset the closing state

        // Remove scroll locking
        const mainContent = document.getElementById('main');
        if (mainContent) {
            mainContent.style.position = '';
            mainContent.style.top = '';
            mainContent.style.left = '';
            mainContent.style.right = '';
            mainContent.style.overflow = '';
        }

        // Restore the window's scroll position
        window.scrollTo(0, scrollYRef.current);

        // Reset the modal context to unmount the modal
        resetModal();
    };

    // Effect to handle opening and closing based on 'show' prop
    useEffect(() => {
        if (show) {
            handleOpen();
            setIsClosing(false); // Ensure it's not in closing state when opening
        }
    }, [show]);

    // Handle closing via button or swipe gesture
    const handleClose = () => {
        if (!isClosing) {
            initiateClose();
        }
    };

    // Touch event handlers remain unchanged
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const currentY = Math.min(moveY, 0);
        const clientY = e.touches[0].clientY;
        setStartY(clientY - currentY);
        if (modalRef.current) {
            modalRef.current.style.transition = 'none';
            modalRef.current.style.overflow = 'hidden';
        }
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const modalHeight = modalRef.current!.offsetHeight;
        const currentY = e.touches[0].clientY;
        const windowH = window.innerHeight;
        const maxMoveY = windowH - modalHeight - modalTop;
        const diffY = Math.max(currentY - startY, maxMoveY);

        if (diffY < maxMoveY) return;

        setMoveY(diffY);

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

        if (blurrable) {
            const blur = Math.max(((windowH - modalTop - diffY) / 100), 0);
            modalRef.current!.style.backdropFilter = `blur(${blur}px)`;
        }
    };

    const handleTouchEnd = () => {
        const modalHeight = modalRef.current!.offsetHeight;
        const maxMoveY = window.innerHeight - modalHeight - modalTop;
        const diffY = Math.max(moveY, maxMoveY);
        const limit = Math.min(window.innerHeight / 5, window.innerHeight * 0.85);

        if (diffY >= 0) {
            if (moveY > limit) {
                initiateClose(); // Use initiateClose instead of resetModal
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
        setMoveY(diffY);
    };

    return (
        (show || isClosing) && (
            <div className={`modal-container ${show && !isClosing ? 'show' : 'closing'}`}>
                <div
                    className="modal"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    ref={modalRef}
                >
                    <div className="modal-header">
                        <Logo image="menu-logo.png" width={60} height={60} />
                        <button
                            className="close"
                            onClick={handleClose} // Change to handleClose
                            role="button"
                            aria-label="Pencereyi Kapat"
                        >
                            Kapat
                        </button>
                    </div>
                    <div className="modal-body">{component}</div>
                </div>
            </div>
        )
    );
};

export default Modal;
