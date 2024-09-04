import { memo, useEffect, useState } from "react";
import { IconButton, LogoutButton, ThemeSwitcher } from "@asim-ui/components";
import { toggleSidebar, useAppDispatch } from "@asim-ui/store";
import { MdMenu } from "react-icons/md";
import DashSidebar from "./sidebar.component";

const Header: React.FC<{isOpen: boolean}> = ({ isOpen }) => {
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useAppDispatch();

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header className={`h-header dash-header ${isMounted && isOpen ? 'open' : ''}`}>
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
          open={isMounted && isOpen} 
          onChange={handleSidebarToggle} 
        />
      </header>
    </>
  );
};

export default memo(Header);
