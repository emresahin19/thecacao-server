import React, { useState, ReactNode, useEffect } from 'react';
import { LoadingContext } from './loading.context';

const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [domContentLoaded, setDomContentLoaded] = useState(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleDomContentLoaded = () => {
                setDomContentLoaded(true);
            };
    
            if (document.readyState === "complete" || document.readyState === "interactive") {
                handleDomContentLoaded();
            } else {
                window.addEventListener("DOMContentLoaded", handleDomContentLoaded);
            }
    
            return () => {
                window.removeEventListener("DOMContentLoaded", handleDomContentLoaded);
            };
        }
    }, []);

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