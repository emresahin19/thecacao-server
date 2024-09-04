import React, { useState, ReactNode } from 'react';
import { LoadingContext } from './loading.context';

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    
    return (
        <LoadingContext.Provider value={{ loaded, setLoaded }}>
            {children}
        </LoadingContext.Provider>
    );
};
