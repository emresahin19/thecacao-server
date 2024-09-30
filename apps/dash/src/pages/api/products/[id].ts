export const config = {
    api: {
        bodyParser: false,
    },
};

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

    const { id } = req.query;
    try {
        let response;
        const headers = {
            Authorization: `Bearer ${token}`,
            'content-type': req.headers['content-type'],
        };

        switch (req.method) {
            case 'GET':
                response = await axios.get(`${apiUrl}/products/${id}`, { headers });
                break;

            case 'POST':
                response = await axios({
                    method: 'post',
                    url: `${apiUrl}/products`,
                    data: req,
                    headers: headers,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 45000,
                });
                break;

            case 'PUT':
                response = await axios({
                    method: 'put',
                    url: `${apiUrl}/products/${id}`,
                    data: req,
                    headers: headers,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 45000,
                });
                break;

            case 'DELETE':
                response = await axios.delete(`${apiUrl}/products/${id}`, { headers });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end({
                    status: false,
                    error: `Method ${req.method} Not Allowed`,
                });
        }
        return res.status(200).json(response.data);
    } catch (err: any) {
        return handleErrorResponse(err, res);
    }
}
