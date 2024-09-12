import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express'; // Add this line

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {

    }
    
    @Post('login')
    async login(@Body() body, @Res() res: Response) { // Add 'Response' as a parameter
        const { access_token } = await this.authService.login(body.email, body.password);
        return res.json(access_token);
    }
}
