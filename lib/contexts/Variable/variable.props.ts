
export interface VariableContextProps {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOverflow: boolean;
    setIsOverflow: React.Dispatch<React.SetStateAction<boolean>>;
    searchOpen: boolean;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resetVariables: () => void;
}
