import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const token = cookies.get('jwt');

    if (!token) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        'content-type': req.headers['content-type'],
    };
    const { items } = req.body;

    if (req.method === 'POST') {
        try {
            const response = await axios.post(`${apiUrl}/products/order`, items, { headers });
            return res.status(200).json(response.data);
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end({
            status: false,
            error: `Method ${req.method} Not Allowed`,
        });
    }
}
