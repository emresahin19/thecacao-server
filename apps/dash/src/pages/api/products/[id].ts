import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { createHeaders, handleErrorResponse } from 'lib/utils';

export const config = {
    api: {
        bodyParser: false, // BodyParser'ı kapatıyoruz, çünkü form-data kullanabiliriz
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const jwtToken = cookies.get('jwt'); // JWT token'ı cookie'den alıyoruz

    if (!jwtToken) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    const { id } = req.query;

    try {
        let response;
        const headers = {
            Authorization: `Bearer ${jwtToken}`, // JWT token'ı Bearer token olarak ekliyoruz
        };

        switch (req.method) {
            case 'GET':
                response = await axios.get(`${apiUrl}/products/${id}`, { headers });
                break;
                
            case 'POST':
                response = await axios.post(`${apiUrl}/products`, req.body, {
                    headers: { ...headers, ...req.headers },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 45000,
                });
                break;

            case 'PUT':
                response = await axios.put(`${apiUrl}/products/${id}`, req.body, {
                    headers: { ...headers, ...req.headers },
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
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        return res.status(200).json(response.data);
    } catch (err: any) {
        return handleErrorResponse(err, res);
    }
}
