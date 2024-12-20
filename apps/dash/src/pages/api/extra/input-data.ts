import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const cookies = new Cookies(req, res);
        const jwtToken = cookies.get('jwt'); 
    
        if (!jwtToken) {
            return res.status(401).json({ error: 'Authentication token not found' });
        }
    
        const headers = {
            Authorization: `Bearer ${jwtToken}`, 
        };
    
        try {
            const response = await axios.get(`${apiUrl}/extra/input-data`, { headers });

            return res.status(200).json(response.data);
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
