import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from '@asim-ui/constants';
import { handleErrorResponse } from '@asim-ui/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body; // Kullanıcı bilgilerini request'ten alıyoruz
        const cookies = new Cookies(req, res);
        
        try {
            // NestJS API'ye login isteği gönderiliyor
            const response = await axios.post(`${apiUrl}/auth/login`, { email, password }, {
                headers: {
                    'Origin': req.headers.origin,
                },
            });

            const { access_token, user } = response.data;

            // JWT token'ı cookie'ye kaydediyoruz
            cookies.set('jwt', access_token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
            });

            // Authenticated status'ü de cookie'ye ekliyoruz
            cookies.set('authenticated', 'true', {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
            });

            // Kullanıcı bilgilerini client'a döndürüyoruz
            return res.status(200).json({ message: 'Login successful', user });
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
