
export interface VariableContextProps {
    loaded: boolean;
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOverflow: boolean;
    setIsOverflow: React.Dispatch<React.SetStateAction<boolean>>;
    searchOpen: boolean;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resetVariables: () => void;
}
