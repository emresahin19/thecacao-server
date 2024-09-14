import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const token = cookies.get('jwt'); // httpOnly cookie'den JWT'yi alıyoruz

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const response = await axios.get(`${apiUrl}/auth/user`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Token'ı header'a ekliyoruz
            },
        });

        return res.status(200).json(response.data);
    } catch (error: any) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}