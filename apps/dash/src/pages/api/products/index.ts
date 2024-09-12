import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from '@asim-ui/constants';
import { handleErrorResponse } from '@asim-ui/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const jwtToken = cookies.get('jwt'); // JWT token'ı cookie'den alıyoruz

    if (!jwtToken) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    const headers = {
        Authorization: `Bearer ${jwtToken}`, // JWT token'ı Bearer token olarak header'da gönderiyoruz
    };

    if (req.method === 'GET') {
        try {
            const queryParams = new URLSearchParams(req.query as any).toString();
            const response = await axios.get(`${apiUrl}/products?${queryParams}`, { headers });
            return res.status(200).json(response.data);
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
