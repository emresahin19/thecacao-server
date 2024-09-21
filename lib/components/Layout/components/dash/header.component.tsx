import React from "react";
import IconButton from "lib/components/Button/components/icon-button.component";
import LogoutButton from "lib/components/Button/components/logout.component";
import ThemeSwitcher from "lib/components/Button/components/theme-switcher.component";

import DashSidebar from "./sidebar.component";
import MdMenu from 'lib/assets/icon/svg/MdMenu.svg'
import { closeSidebar, openSidebar, useAppDispatch, useAppSelector } from 'lib/store';

const Header: React.FC = () => {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  const dispatch = useAppDispatch();

  const handleSidebar = () => {
    if (isOpen) {
      dispatch(closeSidebar());
    } else {
      dispatch(openSidebar());
    }
  }

  return (
    <>
      <header className={`h-header dash-header ${isOpen ? 'open' : ''}`}>
        <div className={`h-container`}>

          <div className="h-side">
            <ul className="header-list">
              <li>
                <IconButton 
                  width={24}
                  onClick={handleSidebar} 
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
        <DashSidebar />
      </header>
    </>
  );
};

export default Header;
