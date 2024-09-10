import React, { memo } from "react"
import { HamburgerButton, IconButton } from "@asim-ui/components";
import { useVariable } from "@asim-ui/contexts";
import { MdMenu, MdOutlineSearch, MdOutlineSearchOff } from "react-icons/md";
import Logo from "../../../Logo/components/logo-image.component";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import('./sidebar.component'))
const SearchModule = dynamic(() => import('../../../Search/components/search.component'))
const CategoryCarousel = dynamic(() => import('./category-thumbnail.component'))

const Header: React.FC = () => {
  const { 
    menuOpen, 
    setMenuOpen,
    resetVariables,
    searchOpen,
    setSearchOpen
  } = useVariable();

  const handleHamburger = () => {
    resetVariables()
    setMenuOpen(!menuOpen)
  }

  const handleSearch = () => {
    resetVariables()
    setMenuOpen(false)
    setSearchOpen(!searchOpen)
  }

  const handleSidebarClose = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="h-header">
        <div className="h-container">

          <div className="h-side">
            <ul className="header-list">
              <li>
                {/* <HamburgerButton 
                  width={24}
                  ariaLabel="Menüyü Aç"
                /> */}
                <IconButton 
                  width={24}
                  onClick={handleHamburger} 
                  ariaLabel="Menüyü Aç"
                >
                  <MdMenu />
                </IconButton>
              </li>
            </ul>
          </div>

          <Logo
            image="menu-logo.png"
            width={58}
            height={58}
          />

          <div className="h-side">
            <ul className="header-list">
              <li>
                <IconButton 
                  width={24}
                  onClick={handleSearch} 
                  ariaLabel="Menüyü Aç"
                  className="h-search-icon"
                >
                  {searchOpen ? <MdOutlineSearchOff /> : <MdOutlineSearch />}
                </IconButton>
              </li>
            </ul>
          </div>
          
          <Sidebar open={menuOpen} onClose={handleSidebarClose} />
        </div>
        <SearchModule />
        <CategoryCarousel />
      </header>
    </>
  )
}

export default memo(Header)