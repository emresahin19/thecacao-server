import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from '@asim-ui/constants';
import { handleErrorResponse } from '@asim-ui/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const cookies = new Cookies(req, res);
        const token = cookies.get('jwt');

        if (!token) {
            return res.status(401).json({ error: 'Authentication token not found' });
        }

        try {
            const response = await axios.post(`${apiUrl}/api/user`, {}, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Origin': req.headers.origin,
                }
            });

            if (response.data.user) {
                await cookies.set('authenticated', 'true', { httpOnly: true, sameSite: 'lax', path: '/' });
            }

            return res.status(200).json(response.data);
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
