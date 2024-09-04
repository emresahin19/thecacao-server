import type { LoginFormProps } from './auth.props';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAppDispatch, setUser, clearUser } from '@asim-ui/store';
import { getCSRFToken, fetchAuthenticatedUser, login, logout } from '@asim-ui/services';
import { AuthContext } from './auth.context';
import { AuthContextType } from './auth.props';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const checkAuth = async () => {
        try {
            await getCSRFToken();
            const { data } = await fetchAuthenticatedUser();
            if (data.status && data.user) {
                setAuthenticated(true);
                dispatch(setUser({ 
                    name: data.user.name, 
                    email: data.user.email
                }));
                router.pathname === '/login' && router.push('/dashboard');
            } else {
                clearAuthenticatedUser();
            }
        } catch (error) {
            clearAuthenticatedUser();
        }
    };

    useEffect(() => {
        checkAuth();
    }, [router]);

    const clearAuthenticatedUser = () => {
        setAuthenticated(false);
        Cookies.remove('authenticated');
        dispatch(clearUser());
        router.pathname !== '/login' && router.push('/login');
    }

    const handleLogout = async () => {
        try {
            const response = await logout();
        
            if (response.status === 204) {
                clearAuthenticatedUser();
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    const handleLogin = async ({email, password, remember = false}: LoginFormProps) => {
        try {
            const response = await login({ email, password, remember });
        
            if (response.status === 204) {
                await checkAuth();
                return true;
            }
            return false;
        } catch (error: any) {
            const statusCode = error.response?.status || 500;
            if (statusCode === 419) {
                await getCSRFToken();
                console.log('csrf token refreshed');
            }
            return false;
        }
    }

    const values: AuthContextType = {
        authenticated,
        setAuthenticated,
        handleLogout,
        handleLogin
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};
