import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import IconButton from './icon-button.component';
import MdArrowBacklos from 'lib/assets/icon/svg/MdArrowBacklos.svg';

const BackButton: React.FC = () => {
    const router = useRouter();
    const previousPathRef = useRef<string | null>(null);

    useEffect(() => {
        const handleRouteChangeStart = (url: string) => {
            previousPathRef.current = router.asPath;
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
        };
    }, [router]);

    const handleBack = () => {
        if (previousPathRef.current) {
            router.push(previousPathRef.current, undefined, { shallow: true });
        } else {
            router.push('/', undefined, { shallow: true });
        }
    };

    return (
        <IconButton 
            width={32}
            className='back-button'
            onClick={handleBack} 
            ariaLabel="Geri Dön"
        >
            <MdArrowBacklos />
        </IconButton>
    );
};

export default BackButton;
