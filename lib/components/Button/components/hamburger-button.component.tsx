import React from 'react';
import IconButton from './icon-button.component';
import { useVariable } from '@asim-ui/contexts';
import MdMenu from 'lib/assets/icon/svg/MdMenu.svg'

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