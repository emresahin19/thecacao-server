// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { apiUrl } from '@asim-ui/constants';
import Cookies from 'cookies';
import { handleErrorResponse } from '@asim-ui/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const cookies = new Cookies(req, res);
        const xsrfToken = cookies.get('XSRF-TOKEN') || '';
        try {
            const response = await axios.post(`${apiUrl}/api/logout`, {}, {
                withCredentials: true,
                headers: {
                    'Cookie': req.headers.cookie,
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                    'Origin': req.headers.origin,
                }
            });

            if(response.status === 204) {
                res.status(204).json({ status: true });
            }
            res.status(401).json({ message: 'Unauthorized' });
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
