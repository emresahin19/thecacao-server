import React from 'react';
import { IconButtonProps } from '../button.props';
import { MdMenu } from 'react-icons/md';
import IconButton from './icon-button.component';
import { useVariable } from '@asim-ui/contexts';

const HamburgerButton: React.FC<IconButtonProps> = ({ icon, onClick = () => {}, disabled = false, width=16, height=width, children, ariaLabel, className }) => {
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
            onClick={onClick} 
            ariaLabel="Menüyü Aç"
        >
            <MdMenu />
        </IconButton>
    );
};

export default HamburgerButton;