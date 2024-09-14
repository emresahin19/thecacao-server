import React from "react";
import IconButton from "lib/components/Button/components/icon-button.component";
import LogoutButton from "lib/components/Button/components/logout.component";
import ThemeSwitcher from "lib/components/Button/components/theme-switcher.component";

import { useAppDispatch } from "@asim-ui/store";
import DashSidebar from "./sidebar.component";
import MdMenu from 'lib/assets/icon/svg/MdOutlineSearch.svg'

const Header: React.FC<{isOpen: boolean}> = ({ isOpen }) => {
  const dispatch = useAppDispatch();

  const handleSidebarToggle = () => {
    // dispatch(toggleSidebar());
  };
  
  return (
    <>
      <header className={`h-header dash-header ${isOpen ? 'open' : ''}`}>
        <div className={`h-container`}>

          <div className="h-side">
            <ul className="header-list">
              <li>
                <IconButton 
                  width={24}
                  onClick={handleSidebarToggle} 
                  ariaLabel="Menüyü Aç"
                >
                  <MdMenu />
                </IconButton>
              </li>
            </ul>
          </div>

          <div className="h-side">
            <ul className="header-list">
              <li>
                <ThemeSwitcher />
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
        <DashSidebar 
          open={isOpen} 
          onChange={handleSidebarToggle} 
        />
      </header>
    </>
  );
};

export default Header;
