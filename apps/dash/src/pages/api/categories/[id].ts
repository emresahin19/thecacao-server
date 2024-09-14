import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const token = cookies.get('jwt'); // JWT token'ı cookie'den alıyoruz

    if (!token) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    const { id } = req.query;

    try {
        let response;
        const headers = {
            Authorization: `Bearer ${token}`, 
        };

        switch (req.method) {
            case 'GET':
                response = await axios.get(`${apiUrl}/categories/${id}`, { headers });
                break;
                
            case 'POST':
                response = await axios.post(`${apiUrl}/categories`, req.body, { headers });
                break;

            case 'PUT':
                response = await axios.put(`${apiUrl}/categories/${id}`, req.body, { headers });
                break;

            case 'DELETE':
                response = await axios.delete(`${apiUrl}/categories/${id}`, { headers });
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
