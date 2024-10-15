export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        }
    },
};

import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { handleErrorResponse } from 'lib/utils';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const jwtToken = cookies.get('jwt'); 

    if (!jwtToken) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    if (req.method === 'POST') {
        const html = req.body.html;
        if (!html) {
            return res.status(400).json({ error: 'HTML content is required' });
        }

        const browserConfig = {
            headless: true,
            args: ['--no-sandbox'],
            ...(process.env.NEXT_PUBLIC_APP_MODE === 'production' ? { executablePath: '/usr/bin/chromium' } : {})
        }
    
        try {
            const browser = await puppeteer.launch(browserConfig);
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                width: '210mm',
                height: '297mm',
            });

            await browser.close();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');
            res.setHeader('Content-Length', pdfBuffer.length.toString());
    
            return res.status(200).end(pdfBuffer);
        } catch (error: any) {
            console.error('PDF oluşturma hatası:', error);
            return handleErrorResponse(error, res);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            status: false,
            error: `Method ${req.method} Not Allowed`,
        });
    }
}
