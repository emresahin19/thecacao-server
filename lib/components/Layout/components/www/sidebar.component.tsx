"use client";
import type { SidebarProps } from "../../layout.props";
import React from "react"
import { useEffect, useState, useRef, TouchEvent } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { routes } from "lib/utils/route.config";
import { useVariable } from "lib/contexts";
import { RootState } from "lib/store";
import { ContactProps } from "lib/interfaces";
import Logo from "../../../Logo/components/logo.component";

const Sidebar: React.FC<SidebarProps> = () => {
    const [contact, setContact] = useState<ContactProps>({
        email: '',
        phone: '',
        facebook: '',
        instagram: '',
        linkedin: ''
    });
    const sidebarRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const contacts = useSelector((state: RootState) => state.menu.contacts); 

    const { 
        menuOpen, 
        setMenuOpen,
    } = useVariable();
    
    useEffect(() => {
        contacts && setContact(contacts);
    }, [contacts]);

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        startXRef.current = e.touches[0].clientX;
        setIsDragging(true);
        if (sidebarRef.current) {
            sidebarRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startXRef.current;
        const sidebarWidth = sidebarRef.current?.offsetWidth || 0;
        const _factor = Math.min(Math.abs(diffX) / sidebarWidth, 1);
        
        if (diffX < 0 && sidebarRef.current) {
            sidebarRef.current.style.transform = `translateX(${diffX}px)`;
        }
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.changedTouches[0].clientX;
        const diffX = currentX - startXRef.current;
        setIsDragging(false);

        if (sidebarRef.current) {
            sidebarRef.current.style.transition = 'transform 0.3s ease';
            if (diffX < -50) {
                sidebarRef.current.style.transform = 'translateX(-100%)';
                setTimeout(() => setMenuOpen(false), 300);
            } else {
                sidebarRef.current.style.transform = 'translateX(0)';
            }
        }
    };

    const handleBackdropClick = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.transition = 'transform 0.3s ease';
            sidebarRef.current.style.transform = 'translateX(-100%)';
            setTimeout(() => setMenuOpen(false), 300);
        }
    };

    useEffect(() => {
        if (sidebarRef.current) {
            sidebarRef.current.style.transition = 'transform 0.3s ease';
            if (menuOpen) {
                sidebarRef.current.style.transform = 'translateX(0)';
            } else {
                sidebarRef.current.style.transform = 'translateX(-100%)';
            }
        }
    }, [menuOpen]);

    return (
        menuOpen && (
            <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`} >
                <div 
                    className="s-container"
                    ref={sidebarRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="s-logo">
                        <Logo
                            width={118}
                            homePath="/menu"
                            color="#fff"
                        />
                    </div>
                    <ul className="s-list">
                        {routes.map((route, index) => (
                            <li key={`route-item-m${index}`}>
                                <Link
                                    className={`link ${route.disabled ? 'disabled' : ''}`}
                                    href={route.path}
                                    onClick={() => {
                                        if (sidebarRef.current) {
                                            sidebarRef.current.style.transition = 'transform 0.3s ease';
                                            sidebarRef.current.style.transform = 'translateX(-100%)';
                                            setTimeout(() => setMenuOpen(false), 300);
                                        }
                                    }}
                                    role="button"
                                    aria-label={`${route.name} sayfasına git`}
                                >
                                    {route.name}
                                    {route.soon && <span className="disabled-text">(Yakında)</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {contact && (
                        <ul className="s-list contact-list">
                            <li>
                                <div className="link">
                                    İletişim
                                </div>
                                <ul className="contact-details">
                                    <li><a href={`tel:${contact.phone}`}>{contact.phone}</a></li>
                                    <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
                                </ul>
                            </li>
                        </ul>
                    )}
                    {contact && (
                        <ul className="s-list">
                            <li>
                                <ul className="social-media">
                                    <li>
                                        <a href={`https://www.facebook.com/${contact.facebook}`} target="_blank" rel="noreferrer">
                                            {`facebook.com/${contact.facebook}`}
                                        </a>
                                    </li>
                                    <li>
                                        <a href={`https://www.instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
                                            {`instagram.com/${contact.instagram}`}
                                        </a>
                                    </li>
                                    {/* <li>
                                        <a href={`https://www.linkedin.com/${contact.linkedin}`} target="_blank" rel="noreferrer">
                                            {`linkedin.com/${contact.linkedin}`}
                                        </a>
                                    </li> */}
                                </ul>
                            </li>
                        </ul>
                    )}
                </div>
                {menuOpen && 
                    <div 
                        className={`backdrop ${menuOpen ? 'open' : ''}`} 
                        onClick={handleBackdropClick}
                        style={{
                            // backdropFilter: `blur(${7 - 7*factor}px)`,
                            // opacity: 1 - factor
                        }}
                    />
                }
            </div>
        )
    );
};

export default Sidebar;
