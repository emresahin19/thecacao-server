import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const cookies = new Cookies(req, res);
        
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { email, password }, {
                headers: {
                    'Origin': req.headers.origin,
                },
            });

            const { access_token, user } = response.data;

            cookies.set('jwt', access_token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
            });

            cookies.set('authenticated', 'true', {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
            });

            return res.status(200).json({ message: 'Login successful', user });
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
