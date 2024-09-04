import { useContext } from "react";
import { AuthContextType } from "./auth.props";
import { AuthContext } from "./auth.context";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
