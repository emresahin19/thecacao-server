"use client";
import type { ModalInitialProps } from "../modal.props";
import React, { useEffect, useRef, useState, TouchEvent } from "react";
import dynamic from "next/dynamic";
import { useModal } from "@asim-ui/contexts";
import { CloseButton } from "@asim-ui/components";
import { getLocalStorageItem } from "@asim-ui/utils";

const Logo = dynamic(() => import('../../Logo/components/logo.component'), { ssr: false });

const modalTop = 0;

const Modal: React.FC<ModalInitialProps> = ({blurrable = false}) => {
    const { show, component, resetModal } = useModal();
    const modalRef = useRef<HTMLDivElement>(null);
    const [startY, setStartY] = useState<number>(0);
    const [moveY, setMoveY] = useState<number>(0);
    const isDarkMode = getLocalStorageItem('darkMode') === 'true';

    const handleClose = () => {
        setMoveY(0);
        document.body.style.overflow = '';
        if (modalRef.current) {
            modalRef.current.style.transform = `translateY(calc(100% + ${modalTop}px)) scale(.85)`;
            modalRef.current.style.transition = 'transform 0.3s ease';
            if(blurrable){
                modalRef.current.style.backdropFilter = `blur(${0}px)`;
            }
        }
    }

    const handleOpen = () => {
        setMoveY(0);
        document.body.style.overflow = 'hidden';
        if (modalRef.current) {
            modalRef.current.style.transform = `translateY(${modalTop}px) scale(1)`;
            modalRef.current.style.transition = 'transform 0.3s ease';
            if(blurrable){
                modalRef.current.style.backdropFilter = `blur(${7}px)`;
            }
        }
    }

    useEffect(() => {
        if (show) {
            handleOpen();
        } else {
            handleClose();
        }
    }, [show])

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const currentY = Math.min(moveY, 0)
        const clientY = e.touches[0].clientY;
        setStartY(clientY - currentY);
        if (modalRef.current) {
            modalRef.current.style.transition = 'none';
            modalRef.current.style.overflow = 'hidden';
        }
    }

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const modalHeight = modalRef.current!.offsetHeight;
        const currentY = e.touches[0].clientY;
        const windowH = window.innerHeight;
        const maxMoveY = windowH - modalHeight - modalTop;
        const diffY = Math.max(currentY - startY, maxMoveY);

        if(diffY < maxMoveY) return;

        setMoveY(diffY);

        if(diffY >= 0){
            const scale = 1 - Math.min(diffY / window.innerHeight, 0.15);
            modalRef.current!.style.transform = `translateY(${modalTop}px) scale(${scale})`;

            if(scale <= 0.85){
                const adjustedDiffY = diffY - (windowH * 0.15);
                modalRef.current!.style.transform = `translateY(${adjustedDiffY}px) scale(0.85)`;
            }
        } else if (diffY < 0) {
            modalRef.current!.style.transform = `translateY(${diffY}px) scale(1)`;
        }

        if(blurrable){
            const blur = Math.max(((windowH - modalTop - diffY) / 100), 0);
            modalRef.current!.style.backdropFilter = `blur(${blur}px)`;
        }
    }

    const handleTouchEnd = () => {
        const modalHeight = modalRef.current!.offsetHeight;
        const maxMoveY = window.innerHeight - modalHeight - modalTop;
        const diffY = Math.max(moveY, maxMoveY);
        const limit = Math.min(window.innerHeight / 5, window.innerHeight*0.85);
        
        if(diffY >= 0){
            if (moveY > limit) {
                if (modalRef.current) {
                    modalRef.current.style.transform = `translateY(calc(100% + ${modalTop}px)) scale(${0.85})`;
                    modalRef.current.style.transition = 'transform 0.3s ease';
                    modalRef.current.style.overflow = '';
                }
                resetModal();
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
    }

    return (
        <div className={`modal-container ${show ? 'show' : ''}`} >
            <div className="modal"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={modalRef}
            >
                <div className="modal-header">
                    <Logo color='#ffffff' width={60} />
                    <button 
                        className="close"
                        onClick={resetModal} 
                        role="button"
                        aria-label="Pencereyi Kapat"
                    >
                        Kapat
                    </button>
                </div>
                <div className="modal-body">
                    {component}
                </div>
            </div>
        </div>
    );
};

export default Modal;
