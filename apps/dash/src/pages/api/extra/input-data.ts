import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from '@asim-ui/constants';
import { createHeaders, handleErrorResponse } from '@asim-ui/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const cookies = new Cookies(req, res);
        const xsrfToken = cookies.get('XSRF-TOKEN');

        if (!xsrfToken) {
            return res.status(401).json({ error: 'CSRF token or session not found' });
        }

        const headers = {
            ...createHeaders(req, xsrfToken),
        };

        try {
            const response = await axios.get(`${apiUrl}/api/extra/input-data`, { headers });

            return res.status(200).json(response.data);
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
