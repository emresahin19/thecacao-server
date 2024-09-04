import React, { useState, ReactNode, useEffect } from 'react';
import { VariableContext } from './variable.context';

export const VariableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isOverflow, setIsOverflow] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined'){
            if(isOverflow) 
                document.body.style.overflow = 'hidden';
            else 
                document.body.style.overflow = '';
        }
    }, [isOverflow])

    const resetVariables = () => {
        setMenuOpen(false);
        setIsOverflow(false);
    }

    const variables = {
        loaded,
        setLoaded,
        menuOpen,
        setMenuOpen,
        isOverflow,
        setIsOverflow,
        searchOpen, 
        setSearchOpen,
        resetVariables,
    }
    return (
        <VariableContext.Provider value={variables}>
            {children}
        </VariableContext.Provider>
    );
};
