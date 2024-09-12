import type { LoginFormProps } from './auth.props';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAppDispatch, setUser, clearUser } from '@asim-ui/store';
import { fetchAuthenticatedUser, login, logout } from '@asim-ui/services'; // getCSRFToken kaldırıldı
import { AuthContext } from './auth.context';
import { AuthContextType } from './auth.props';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Auth durumu kontrol ediliyor
    const checkAuth = async () => {
        try {
            // JWT token var mı kontrol et
            const token = Cookies.get('jwt');
            if (!token) {
                clearAuthenticatedUser();
                return;
            }

            // Authenticated user'ı al
            const { data } = await fetchAuthenticatedUser();

            if (data.status && data.user) {
                setAuthenticated(true);
                dispatch(setUser({
                    name: data.user.name,
                    email: data.user.email,
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

    // Auth durumunu temizleme
    const clearAuthenticatedUser = () => {
        setAuthenticated(false);
        Cookies.remove('jwt'); // JWT token'ı cookie'den siliyoruz
        Cookies.remove('authenticated'); // authenticated durumu da temizleniyor
        dispatch(clearUser());
        router.pathname !== '/login' && router.push('/login');
    };

    // Logout işlemi
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

    // Login işlemi
    const handleLogin = async ({ email, password, remember = false }: LoginFormProps) => {
        try {
            // Login request'i ile token alıyoruz
            const response = await login({ email, password, remember });
            console.log(    response);
            if (response.status === 200) {
                Cookies.set('jwt', response.data.access_token, { httpOnly: true }); // JWT token'ı cookie'ye kaydediyoruz
                await checkAuth(); // Auth durumu güncelleniyor
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
