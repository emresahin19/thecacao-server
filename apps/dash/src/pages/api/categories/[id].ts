export const config = {
    api: {
        bodyParser: false,
    },
};

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from '@asim-ui/constants';
import { createHeaders, handleErrorResponse } from '@asim-ui/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const xsrfToken = cookies.get('XSRF-TOKEN');

    if (!xsrfToken) {
        return res.status(401).json({ error: 'CSRF token or session not found' });
    }

    const { id } = req.query;

    try {
        let response;
        const headers = {
            ...createHeaders(req, xsrfToken),
        };
        
        switch (req.method) {
            case 'GET':
                response = await axios.get(`${apiUrl}/api/categories/${id}`, { headers });
                break;
                
            case 'POST':
                response = await axios({
                    method: 'post',
                    url: `${apiUrl}/api/categories`,
                    data: req, // Orijinal request verisini iletin
                    headers: {...headers, ...req.headers},
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 45000,
                });
                break;

            case 'PUT':
                response = await axios({
                    method: 'post',
                    url: `${apiUrl}/api/categories/${id}?_method=put`,
                    data: req,
                    headers: {...headers, ...req.headers},
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 45000,
                });
                break;

            case 'DELETE':
                response = await axios.delete(`${apiUrl}/api/categories/${id}`, { headers });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        return res.status(200).json(response.data);
    } catch (err: any) {
        return handleErrorResponse(err, res);
    }
}
