import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Response, Request } from 'express'; // Add this line
import { CreateLoginDto } from './dto/create-login.dto';
import { StatusCode } from '../common/constants';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {
    }
    @Post('login')
    async login(@Body() loginDto: CreateLoginDto, @Res() res: Response) {
        try {
            const result = await this.authService.login(loginDto);
            return res.status(StatusCode.SUCCESS.statusCode).json({
                message: StatusCode.SUCCESS.message,
                ...result,
            });
        } catch (error) {
            return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                message: StatusCode.UNAUTHORIZED.message,
            });
        }
    }
    
    @UseGuards(JwtAuthGuard)

    @Get('user')
    getAuthenticatedUser(@Req() req: Request, @Res() res: Response) {
        const user = req.user;
        return res.status(StatusCode.SUCCESS.statusCode).json({
            message: StatusCode.SUCCESS.message,
            user,
        });
    }
}
