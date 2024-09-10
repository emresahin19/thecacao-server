import React from 'react';
import IconButton from './icon-button.component';
import { useVariable } from '@asim-ui/contexts';
import { MdOutlineSearch, MdOutlineSearchOff } from "react-icons/md";

const SearchButton: React.FC = () => {
    const { 
      setMenuOpen,
      resetVariables,
      searchOpen,
      setSearchOpen
    } = useVariable();
  
    const handleSearch = () => {
      resetVariables()
      setMenuOpen(false)
      setSearchOpen(!searchOpen)
    }
  
    return (
        <IconButton 
            width={24}
            onClick={handleSearch} 
            ariaLabel="Ara"
        >
            {searchOpen ? <MdOutlineSearchOff /> : <MdOutlineSearch />}
        </IconButton>
    );
};

export default SearchButton;