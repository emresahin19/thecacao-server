import React from "react";
import MdOutlineRefresh from 'lib/assets/icon/svg/MdOutlineRefresh.svg'
import IconButton from "./icon-button.component";
import { useRouter } from "next/router";

const RefreshButton: React.FC = () => {
    const router = useRouter();
    const handleRefresh = () => {
        router.reload();
    }

    return (
        <IconButton 
            width={24}
            onClick={handleRefresh} 
            ariaLabel="Yenile"
        >
            <MdOutlineRefresh />
        </IconButton>
    )
}

export default RefreshButton;