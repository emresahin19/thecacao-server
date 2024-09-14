import type { LoginFormProps } from './auth.props';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAppDispatch, setUser, clearUser } from 'lib/store';
import { fetchAuthenticatedUser, login, logout } from 'lib/services'; 
import { AuthContext } from './auth.context';
import { AuthContextType } from './auth.props';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Auth durumu kontrol ediliyor
    const checkAuth = async () => {
        try {
            // Next.js API'ye istek gönderiyoruz (Sunucu tarafında kimlik doğrulama)
            const { data } = await axios.get('/api/auth/user');
            if (data) {
                setAuthenticated(true);
                dispatch(setUser({
                    name: data.user.name,
                    email: data.user.email,
                }));
    
                if (router.pathname === '/login') {
                    router.push('/dashboard'); // Giriş başarılıysa dashboard'a yönlendirme
                }
            } else {
                clearAuthenticatedUser();
            }
        } catch (error) {
            clearAuthenticatedUser();
        }
    };

    useEffect(() => {
        checkAuth(); // Sayfa yüklendiğinde auth durumu kontrol ediliyor
    }, [router]);

    // Auth durumunu temizleme
    const clearAuthenticatedUser = () => {
        setAuthenticated(false);
        Cookies.remove('jwt'); // JWT token'ı cookie'den siliyoruz
        Cookies.remove('authenticated'); // authenticated durumu da temizleniyor
        dispatch(clearUser());
        if (router.pathname !== '/login') {
            router.push('/login'); // Kullanıcı login sayfasına yönlendiriliyor
        }
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

    // Login işlemi (artık kullanıcı bilgileri login yanıtında geliyor)
    const handleLogin = async ({ email, password, remember = false }: LoginFormProps) => {
        try {
            // Login isteği yapılır ve token alınır
            const response = await login({ email, password, remember });
            if (response.status === 200) {
                Cookies.set('jwt', response.data.access_token, { sameSite: 'lax', path: '/' }); 
                
                // Kullanıcı bilgileri login yanıtından geliyor
                const { user } = response.data;
                setAuthenticated(true);
                dispatch(setUser({
                    name: user.name,
                    email: user.email,
                }));
                router.push('/dashboard'); // Giriş başarılıysa dashboard'a yönlendirme
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
