import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';
import { MenuInitialProps } from 'lib/interfaces';

let initialData: MenuInitialProps = {
    items: null,
    contacts: null,
};

let cacheTime = Date.now();
const CACHE_DURATION = 15 * 60 * 1000;

export const fetchMenuData = async () => {
    try {
        if (!initialData.items || !initialData.contacts || Date.now() - cacheTime > CACHE_DURATION) {
            const { data } = await axios.get(`${apiUrl}/menu`);
            const { items, contacts }: MenuInitialProps = data;
            initialData.items = items;
            initialData.contacts = contacts;
            cacheTime = Date.now(); // Cache zamanını güncelle
        }
        return initialData;
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    // const jwtToken = cookies.get('jwt'); // JWT token'ı cookie'den alıyoruz

    // if (!jwtToken) {
    //     return res.status(401).json({ error: 'Authentication token not found' });
    // }

    // const headers = {
    //     Authorization: `Bearer ${jwtToken}`, // JWT token'ı Bearer token olarak header'da gönderiyoruz
    // };

    if (req.method === 'GET') {
        try {
            const { data } = await axios.get(`/menu`);
            const { items, contacts }: MenuInitialProps = data;
            return res.status(200).json({ items, contacts });
        } catch (err: any) {
            return handleErrorResponse(err, res);
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
