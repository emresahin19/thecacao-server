import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { SocialService } from './social.service';
import { Response } from 'express';

@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) {}

    /**
     * Kullanıcıyı Instagram izin ekranına yönlendirmek için gerekli URL'yi döner.
     */
    @Get('auth')
    redirectToInstagram(@Res() res: Response) {
        const url = this.socialService.getInstagramAuthUrl();
        return res.redirect(url);
    }

    /**
     * Instagram'da izin verildikten sonra bu callback URL'sine code parametresi gelir.
     * Bu code kullanılarak token alınır ve saklanır.
     */
    @Get('auth/callback')
    async authCallback(@Query('code') code: string, @Res() res: Response) {
        if (!code) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Code parametresi bulunamadı.' });
        }

        try {
            await this.socialService.exchangeCodeForToken(code);
            return res.status(HttpStatus.OK).json({ message: 'Token alındı, şimdi media endpointine istekte bulunabilirsiniz.' });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    /**
     * Token alındıysa, bu endpoint üzerinden kullanıcının medyalarını çekebilirsiniz.
     */
    @Get('media')
    async getUserMedia(@Res() res: Response) {
        try {
            const media = await this.socialService.getUserMedia();
            return res.status(HttpStatus.OK).json(media);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}
