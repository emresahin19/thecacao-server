import React, { useEffect, useState, useRef, TouchEvent, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { SidebarItemProps } from "../../layout.props";
import dashRoutes from "lib/utils/dash-route.config";
import { useAppDispatch, useAppSelector, closeSidebar, openSidebar } from "lib/store";

const Logo = dynamic(() => import('../../../Logo/components/logo.component'), { ssr: false });
const transition = '0.3s cubic-bezier(.22,.61,.36,1) transform';

const Sidebar: React.FC = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.sidebar.isOpen);
    const router = useRouter();

    const isInteractiveElement = useCallback((element: HTMLElement): boolean => {
        const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
        if (interactiveTags.includes(element.tagName)) return true;
        if (element.closest('.interactive')) return true;
        return false;
    }, []);

    const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (isInteractiveElement(target)) return;

        startXRef.current = e.touches[0].clientX;
        setIsDragging(true);
        if (sidebarRef.current) {
            sidebarRef.current.style.transition = 'none';
        }
    }, [isInteractiveElement]);

    const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startXRef.current;

        if (diffX < 0 && sidebarRef.current) {
            sidebarRef.current.style.transform = `translateX(${diffX}px)`;
        }
    }, [isDragging]);

    const handleTouchEnd = useCallback((e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const target = e.target as HTMLElement;
        if (isInteractiveElement(target)) return;

        const currentX = e.changedTouches[0].clientX;
        const diffX = currentX - startXRef.current;
        setIsDragging(false);

        if (sidebarRef.current) {
            sidebarRef.current.style.transition = transition;
            if (diffX < -50) {
                sidebarRef.current.style.transform = 'translateX(-110%)';
                dispatch(closeSidebar());
            } else {
                sidebarRef.current.style.transform = 'translateX(0)';
                dispatch(openSidebar());
            }
        }
    }, [isDragging, isInteractiveElement, dispatch]);

    const isActive = useCallback((href: string = '') => {
        if(href === '') return false;
        if (router.pathname === href) return true;
        return false;
    }, [router.pathname]);

    const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, href }) => {
        return (
            <Link
                className={`link no-hover ${isActive(href) ? 'active' : ''}`}
                draggable="false"
                href={href || '/'}
                role="button"
                aria-label={`${label} sayfasına git`}
                onClick={() => dispatch(closeSidebar())}
            >
                {label}
            </Link>
        )
    }
    
    useEffect(() => {
        if (sidebarRef.current) {
            sidebarRef.current.style.transition = transition;
            const wrapper = document.body;
            if (isOpen) {
                sidebarRef.current.style.transform = 'translateX(0)';
                wrapper.classList.add('overflow-disabled');
                wrapper.style.top = `-${window.scrollY}px`;
            } else {
                sidebarRef.current.style.transform = 'translateX(-110%)';
                setTimeout(() => {
                    wrapper.classList.remove('overflow-disabled');
                    wrapper.style.top = '';
                }, 300);
            }
        }
    }, [isOpen]);

    return (
        <div 
            className={`dash-sidebar ${isOpen ? 'open' : ''}`}
            ref={sidebarRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="dash-sidebar-logo">
                <Logo color="#fff" width={'100%'} />
            </div>
            <ul className="dash-sidebar-list">
                {dashRoutes.map((route: SidebarItemProps, index: number) => (
                    <li key={`route-item-m${index}`}>
                        {route.children ? (
                            <>
                                <span className="category-label">{route.label}</span>
                                <ul className="category-list">
                                    {route.children.map((child: SidebarItemProps, childIndex: number) => (
                                        <li key={`route-item-c${childIndex}`} >
                                            <SidebarItem 
                                                label={child.label} 
                                                icon={child.icon} 
                                                href={child.href}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <SidebarItem 
                                key={`route-item-c${index}`} 
                                label={route.label} 
                                icon={route.icon} 
                                href={route.href}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
