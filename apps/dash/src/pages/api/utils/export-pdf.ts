import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { handleErrorResponse } from 'lib/utils';
import puppeteer from 'puppeteer';

const domToHtmlPage = (html: string) => (
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Export</title>
        <style>
            .a4-page {
                width: 210mm;
                height: 297mm;
                background-color: white;
                margin: auto;
            }
            .export-items {
                display: flex;
                flex-direction: column;
                gap: 10px;
                overflow: hidden;
                padding: 16px;
                height: calc(100% - 32px);
                width: calc(100% - 32px);
            }
            .export-card {
                flex-direction: row;
                display: flex;
                align-items: center;
                max-height: 10%;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0px 1px 2px 0px rgba(var(--primary-rgb), 0.1);
                width: 100%;
                height: 100%;
                gap: 8px;
                color: var(--black);

            }
            .export-card .card-image {
                width: 20%;
                height: auto;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                max-height: 100%;
            }
            .export-card .card-image img {
                width: 100%;
                height: auto;
                max-height: 100%;
            }
            .export-card .title {
                font-weight: 400;
                display: flex;
                align-items: center;
                margin: 0;
                font-size: 16px;
                width: 20%;
                color: var(--black);
            }
            .export-card p {
                width: 60%;
                margin: 0;
                color: var(--black);
                text-align: start;
                padding-left: 16px;
            }
        </style>
    </head>
    <body>
        ${html}
    </body>
    </html>`
)

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
            await page.setContent(domToHtmlPage(html), { waitUntil: 'networkidle0' });

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
