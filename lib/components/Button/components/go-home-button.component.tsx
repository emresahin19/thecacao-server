import React from 'react';
import IconButton from './icon-button.component';
import GoHome from 'lib/assets/icon/svg/GoHome.svg'
import { useRouter } from 'next/router';

const GoHomeButton: React.FC<{ path: string }> = ({ path = '/' } : { path?: string }) => {
    const router = useRouter();

    return (
        <IconButton
            onClick={() => router.push(path)}
            width={24}
            ariaLabel="Anasayfaya Git"
        >
            <GoHome />
        </IconButton>
    )
}

export default GoHomeButton