import React from 'react';
import IconButton from './icon-button.component';
// import { CiLogin } from "react-icons/ci";
import { useAuth } from '@asim-ui/contexts';

const LogoutButton: React.FC = () => {
    const { handleLogout } = useAuth();

    return (
        <IconButton
            onClick={handleLogout}
            ariaLabel="Çıkış Yap"
        >
            {/* <CiLogin /> */}
        </IconButton>
    )
}

export default LogoutButton