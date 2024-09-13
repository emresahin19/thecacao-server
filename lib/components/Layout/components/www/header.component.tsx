import React, { memo } from "react"
import Logo from "../../../Logo/components/logo.component";
import dynamic from "next/dynamic";
import { defaultColor } from "@asim-ui/constants";

const Sidebar = dynamic(() => import('./sidebar.component'), { ssr: false })
const SearchModule = dynamic(() => import('../../../Search/components/search.component'), { ssr: false })
const HamburgerButton = dynamic(() => import('../../../Button/components/hamburger-button.component'), { ssr: false })
const SearchButton = dynamic(() => import('../../../Button/components/search-button.component'), { ssr: false })

// const CategoryCarousel = dynamic(() => import('./category-thumbnail.component'))

const Header: React.FC = () => {
  
  return (
    <>
      <header className="h-header">
        <div className="h-container">

          <div className="h-side">
            <ul className="header-list">
              <li>
                <HamburgerButton/>
              </li>
            </ul>
          </div>

          <Logo
            width={58}
            color={defaultColor}
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