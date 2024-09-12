import React from "react";
import { IconButton, LogoutButton, ThemeSwitcher } from "@asim-ui/components";
import { toggleSidebar, useAppDispatch } from "@asim-ui/store";
import { MdMenu } from "react-icons/md";
import DashSidebar from "./sidebar.component";

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
