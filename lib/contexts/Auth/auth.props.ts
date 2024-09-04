
export interface LoginFormProps {
    email: string
    password: string
    remember?: boolean
}

export interface AuthContextType {
    authenticated: boolean;
    setAuthenticated: (authenticated: boolean) => void;
    handleLogout: () => void;
    handleLogin: (credentials: LoginFormProps) => void;
}
