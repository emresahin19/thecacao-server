import React, { ReactNode, useEffect, useState } from 'react';
import { closeSidebar, openSidebar, useAppDispatch, useAppSelector } from '../store';
import { useRouter } from 'next/router';
import { useLoading } from '../contexts';
import DashHeader from '../components/Layout/components/dash/header.component';
import Modal from '../components/Modal/components/modal.component';
import Footer from '../components/Layout/components/dash/footer.component';

type Props = {
    children: ReactNode;
};

export default function LayoutAuthenticated({ children }: Props) {
    const isOpen = useAppSelector((state) => state.sidebar.isOpen);
    const [isMounted, setIsMounted] = useState(false);
    const { setLoaded } = useLoading();
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                dispatch(closeSidebar()); 
            } else {
                dispatch(openSidebar());
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]);

    useEffect(() => {
        setIsMounted(true);

        const handleStart = () => setLoaded(false);
        const handleComplete = () => setLoaded(true);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <>
            <DashHeader />
            <main className={`dash-main ${isMounted && isOpen ? 'open' : ''}`}>
                {children}
            </main>
            <Modal />
            <Footer />
        </>
    );
}
