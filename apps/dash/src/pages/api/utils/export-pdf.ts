import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Cookies from 'cookies';
import { apiUrl } from 'lib/constants';
import { handleErrorResponse } from 'lib/utils';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const jwtToken = cookies.get('jwt'); 

    if (!jwtToken) {
        return res.status(401).json({ error: 'Authentication token not found' });
    }

    const headers = {
        Authorization: `Bearer ${jwtToken}`, 
    };

    if (req.method === 'POST') {
        const html = req.body.html;
        if (!html) {
            return res.status(400).send('HTML content is required');
        }
    
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4' });
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
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end({
            status: false,
            error: `Method ${req.method} Not Allowed`,
        });
    }
}
