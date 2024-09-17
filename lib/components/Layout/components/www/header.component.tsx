import React, { memo } from "react"
import Logo from "../../../Logo/components/logo.component";
import dynamic from "next/dynamic";
import SearchButton from "../../../Button/components/search-button.component";
import HamburgerButton from "../../../Button/components/hamburger-button.component";

const Sidebar = dynamic(() => import('./sidebar.component'), { ssr: false })
const SearchModule = dynamic(() => import('../../../Search/components/search.component'), { ssr: false })

const Header: React.FC = () => {
  
  return (
    <>
      <header className="h-header">
        <div className="h-container" style={{display:'flex',justifyContent:'space-between',height: 60}}>

          <div className="h-side">
            <ul className="header-list">
              <li>
                <HamburgerButton/>
              </li>
            </ul>
          </div>

          <Logo
            width={58}
            homePath="menu"
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