import React from "react"
import Link from "next/link"
import CookieUsage from "./cookie-usage.component"
import { CiHeart } from "react-icons/ci"

const Footer: React.FC = () => {

    return (
        <footer className="footer">
            <CookieUsage />
            <div className="f-container">
                Made by 
                <Link className="atc-link" href="https://asimthecat.com" target="_blank">asimthecat.com</Link>
                w
                <CiHeart />
            </div>
        </footer>
    )
}

export default Footer