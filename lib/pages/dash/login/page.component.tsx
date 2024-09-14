import React, { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { useAuth } from '@asim-ui/contexts'
import { LoginFormProps } from '@asim-ui/interfaces'
import { Button, Checkbox, Input } from '@asim-ui/components'
import { useLoading } from '@asim-ui/contexts'
import { LayoutGuest } from '@asim-ui/layouts'

const LoginPage = () => {
    const { handleLogin } = useAuth();
    const { setLoaded } = useLoading();

    const [credentials, setCredentials] = React.useState<LoginFormProps>({
        email: '',
        password: '',
        remember: false,
    })

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (emailRef.current) {
            const emailValue = emailRef.current.value;
            if (emailValue) {
                setCredentials(prev => ({ ...prev, email: emailValue }));
            }
        }
        if (passwordRef.current) {
            const passwordValue = passwordRef.current.value;
            if (passwordValue) {
                setCredentials(prev => ({ ...prev, password: passwordValue }));
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoaded(true);
            await handleLogin(credentials);
        } catch (error) {
            console.error(error);
        } finally {
            setLoaded(false);
        }
    };

    return (
        <div className='login-container'>
            <div className="logo-bg">
                {/* <LogoText width={420} /> */}
            </div>
            <div className='card'>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <Input
                            ref={emailRef}
                            type='text'
                            label='E-mail'
                            name='email'
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <Input
                            ref={passwordRef}
                            type='password'
                            label='Password'
                            name='password'
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <Checkbox
                            label='Remember me'
                            id='remember'
                            name='remember'
                            onChange={(e) => setCredentials({ ...credentials, remember: e.target.checked })}
                        />
                    </div>
                    <div className="button-area">
                        <Button 
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSubmit}
                            property='default'
                        >
                            Giriş Yap
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
