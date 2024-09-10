import React from 'react';
import { MdMenu } from 'react-icons/md';
import IconButton from './icon-button.component';
import { useVariable } from '@asim-ui/contexts';

const HamburgerButton: React.FC = () => {
    const { 
      menuOpen, 
      setMenuOpen,
      resetVariables,
    } = useVariable();
  
    const handleHamburger = () => {
        resetVariables()
        setMenuOpen(!menuOpen)
    }
    
    return (
        <IconButton 
            width={24}
            onClick={handleHamburger} 
            ariaLabel="Menüyü Aç"
        >
            <MdMenu />
        </IconButton>
    );
};

export default HamburgerButton;