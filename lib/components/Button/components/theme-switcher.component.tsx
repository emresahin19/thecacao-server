import React, { useEffect, useState } from 'react';
import IconButton from './icon-button.component';
import { getLocalStorageItem } from '@asim-ui/utils';
import { setDarkMode, useAppDispatch } from '@asim-ui/store';
import { CiCloudMoon, CiSun } from "react-icons/ci";

const ThemeSwitcher: React.FC = () => {
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
    const dispatch = useAppDispatch();

    const setTheme = () => {
        const isDarkMode = getLocalStorageItem('darkMode') === 'true';
        if (isDarkMode) {
            dispatch(setDarkMode(false));
            setIsDarkModeEnabled(false);
        } else {
            dispatch(setDarkMode(true));
            setIsDarkModeEnabled(true);
        }
    };

    useEffect(() => {
        setTheme();
    }, []);

    return (
        <IconButton 
            width={24}
            onClick={setTheme} 
            ariaLabel="Tema Değiştir"
            className="menu-button"
        >
            {isDarkModeEnabled ? <CiCloudMoon /> : <CiSun />}
        </IconButton>
    )
}

export default ThemeSwitcher