import type { LoginFormProps } from './auth.props';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAppDispatch, setUser, clearUser } from 'lib/store';
import { login, logout } from 'lib/services'; 
import { AuthContext } from './auth.context';
import { AuthContextType } from './auth.props';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null); // Saklanacak route
    const router = useRouter();
    const dispatch = useAppDispatch();

    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/user');
            if (data) {
                setAuthenticated(true);
                dispatch(setUser({
                    name: data.user.name,
                    email: data.user.email,
                }));
    
                if (router.pathname === '/login') {
                    const redirectTo = redirectAfterLogin || '/dashboard'; // Saklanan route'a veya dashboard'a yönlendir
                    router.push(redirectTo);
                }
            } else {
                clearAuthenticatedUser();
            }
        } catch (error) {
            clearAuthenticatedUser();
        }
    };

    useEffect(() => {
        // Eğer kullanıcı authenticated değilse ve login sayfasında değilse, geldiği yolu sakla
        if (!authenticated && router.pathname !== '/login') {
            setRedirectAfterLogin(router.asPath);
        }

        checkAuth();
    }, [router]);

    const clearAuthenticatedUser = () => {
        setAuthenticated(false);
        Cookies.remove('jwt');
        Cookies.remove('authenticated');
        dispatch(clearUser());
        if (router.pathname !== '/login') {
            router.push('/login');
        }
    };

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
    };

    const handleLogin = async ({ email, password, remember = false }: LoginFormProps) => {
        try {
            const response = await login({ email, password, remember });
            if (response.status === 200) {
                Cookies.set('jwt', response.data.access_token, { sameSite: 'lax', path: '/' }); 
                
                const { user } = response.data;
                setAuthenticated(true);
                dispatch(setUser({
                    name: user.name,
                    email: user.email,
                }));

                // Login başarılı olduğunda saklanan route varsa oraya yönlendir, yoksa dashboard'a yönlendir
                const redirectTo = redirectAfterLogin || '/dashboard';
                router.push(redirectTo);

                return true;
            }
            return false;
        } catch (error: any) {
            return false;
        }
    };

    const values: AuthContextType = {
        authenticated,
        setAuthenticated,
        handleLogout,
        handleLogin,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};
