import React from "react"
import { TogglerProps } from "../input.props"
// import { Logo } from "@asim-ui/components"

const Toggler: React.FC<TogglerProps> = ({label, value, name, onChange}) => {
    return (
        <div className="remember-me">
            <label className="switch">
                <input type="checkbox" name={name} checked={value} onChange={onChange} />
                <span>
                    {/* <Logo /> */}
                </span>
            </label>
            <span className="text">{label || ''}</span>
        </div>
    )
}

export default Toggler