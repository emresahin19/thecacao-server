import React, { memo } from "react"
import dynamic from "next/dynamic";
import { IconButton, SearchModule, Sidebar } from "@asim-ui/components";
import { useVariable } from "@asim-ui/contexts";
import CategoryCarousel from "./category-thumbnail.component";
import { MdMenu, MdOutlineSearch, MdOutlineSearchOff } from "react-icons/md";

const Logo = dynamic(() => import('../../../Logo/components/logo.component'), { ssr: false });

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

          <Logo width={58} />

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