import React from 'react';
import IconButton from './icon-button.component';
import { useVariable } from '@asim-ui/contexts';
import MdOutlineSearch from 'lib/assets/icon/svg/MdOutlineSearch.svg'
import MdOutlineSearchOff from 'lib/assets/icon/svg/MdOutlineSearchOff.svg'

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