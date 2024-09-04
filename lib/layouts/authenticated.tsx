import React, { ReactNode, useEffect, useState } from 'react';
import { DashFooter, DashHeader, Footer, Modal } from '@asim-ui/components';
import { useAppSelector } from '@asim-ui/store';
import { useRouter } from 'next/router';
import { useLoading } from '@asim-ui/contexts';

type Props = {
    children: ReactNode;
};

export default function LayoutAuthenticated({ children }: Props) {
    const isOpen = useAppSelector((state) => state.sidebar.isOpen);
    const [isMounted, setIsMounted] = useState(false);
    const { setLoaded } = useLoading();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);

        const handleStart = () => setLoaded(true);
        const handleComplete = () => setLoaded(false);

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
            <DashHeader isOpen={isOpen} />
            <main className={`dash-main ${isMounted && isOpen ? 'open' : ''}`}>
                {children}
            </main>
            <Modal />
            <Footer />
        </>
    );
}
