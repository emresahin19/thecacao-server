
export interface VariableContextProps {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchOpen: boolean;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resetVariables: () => void;
    goHome: (home?: string) => void;
}
