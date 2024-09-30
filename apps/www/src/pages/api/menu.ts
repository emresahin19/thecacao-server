import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl, menuCacheKey } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';
import { MenuInitialProps } from 'lib/interfaces';
import { RedisService } from 'lib/utils/redis';

export const fetchMenuData = async () => {
    const redisService = new RedisService();
    try {
        const cachedData = await redisService.get(menuCacheKey);
        if (cachedData) {
            return cachedData;
        }

        const { data } = await axios.get(`${apiUrl}/menu`);
        const { items, contacts, extraData }: MenuInitialProps = data;

        return { items, contacts, extraData };
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { data } = await axios.get(`${apiUrl}/menu`);
            const { items, contacts, extraData }: MenuInitialProps = data;
    
            return res.status(200).json({ items, contacts });
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
