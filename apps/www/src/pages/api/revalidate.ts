import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    if (req.body.secret !== process.env.MY_SECRET_TOKEN) {
        return res.status(401).json({ message: 'Invalid secret token' });
    }

    const { path } = req.body;

    try {
        if (!path) {
            const pathsToRevalidate = ['/menu'];
            await Promise.all(pathsToRevalidate.map(async (path) => {
                await res.revalidate(path);
            }));

            return res.json({
                message: 'All specified paths revalidated',
                paths: pathsToRevalidate,
            });
        }

        await res.revalidate(path);
        return res.json({ revalidated: true, path });
    } catch (err: any) {
        return res.status(500).json({ message: 'Error revalidating', error: err.message });
    }
}
