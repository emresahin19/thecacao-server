import React, { memo } from "react"
import Logo from "../../../Logo/components/logo-image.component";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import('./sidebar.component'), { ssr: false })
const SearchModule = dynamic(() => import('../../../Search/components/search.component'), { ssr: false })
const HamburgerButton = dynamic(() => import('../../../Button/components/hamburger-button.component'), { ssr: false })
const SearchButton = dynamic(() => import('../../../Button/components/search-button.component'), { ssr: false })

const Header: React.FC = () => {
  
  return (
    <>
      <header className="h-header">
        <div className="h-container" style={{display:'flex',justifyContent:'space-between'}}>

          <div className="h-side">
            <ul className="header-list">
              <li>
                <HamburgerButton/>
              </li>
            </ul>
          </div>

          <Logo
            image="menu-logo.png"
            width={60}
            height={60}
          />

          <div className="h-side">
            <ul className="header-list">
              <li>
                <SearchButton />
              </li>
            </ul>
          </div>
          
          <Sidebar />
        </div>
        <SearchModule />
      </header>
    </>
  )
}

export default memo(Header)