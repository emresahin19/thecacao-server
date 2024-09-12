import React, { useState, ReactNode, useEffect } from 'react';
import { LoadingContext } from './loading.context';

const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [domContentLoaded, setDomContentLoaded] = useState(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleLoad = () => {
                setDomContentLoaded(true);
                setLoaded(true); // Tüm içerik yüklendiğinde loaded state'ini true yapıyoruz
            };
    
            // Tarayıcıda döküman tam yüklendiyse hemen loaded yap
            if (document.readyState === "complete") {
                handleLoad();
            } else {
                // Eğer döküman henüz tam yüklenmediyse "load" eventini dinle
                window.addEventListener("load", handleLoad);
            }

            // Hata durumlarını yakalamak için timeout ekliyoruz (örneğin 10 saniye sonra)
            const timeout = setTimeout(() => {
                if (!loaded) {
                    setLoaded(true); // 10 saniye sonra loaded durumunu true yapıyoruz
                }
            }, 10000);

            return () => {
                window.removeEventListener("load", handleLoad);
                clearTimeout(timeout); // Cleanup timeout
            };
        }
    }, [loaded]);

    const values = {
        loaded,
        setLoaded,
        domContentLoaded,
        setDomContentLoaded,
    };

    return (
        <LoadingContext.Provider value={values}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;
