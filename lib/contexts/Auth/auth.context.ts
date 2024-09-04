import { createContext } from "react";
import { AuthContextType } from "./auth.props";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
