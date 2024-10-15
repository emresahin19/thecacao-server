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
            /* Temel CSS ekleyin veya public klasöründen gerekli dosyaları dahil edin */
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
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
                printBackground: true, // Arka planı dahil eder
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm'
                }
            });

            await browser.close();
    
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');
            res.setHeader('Content-Length', pdfBuffer.length.toString());
    
            return res.status(200).send(pdfBuffer);
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
