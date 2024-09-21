import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const cookies = new Cookies(req, res);

        cookies.set('jwt', '', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            expires: new Date(0),
        });

        cookies.set('authenticated', '', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            expires: new Date(0),
        });

        return res.status(204).json({ message: 'Logout successful' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
