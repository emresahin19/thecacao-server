import React, { useState, ReactNode, useEffect } from 'react';
import { VariableContext } from './variable.context';
import { useModal } from '../Modal';
import { useRouter } from 'next/router';

export const VariableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const { resetModal } = useModal();
    const router = useRouter();
    
    const goHome = (home = '/') => {
        if (typeof window !== 'undefined') {
            if (window.location.pathname === home) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                resetVariables();
            } else {
                router.push(home);
            }
        }
    }

    const resetVariables = () => {
        setMenuOpen(false);
        setSearchOpen(false);
        resetModal();
    }

    const variables = {
        menuOpen,
        setMenuOpen,
        searchOpen, 
        setSearchOpen,
        resetVariables,
        goHome,
    }
    return (
        <VariableContext.Provider value={variables}>
            {children}
        </VariableContext.Provider>
    );
};
