import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'
import { CreateLoginDto } from './dto/create-login.dto';
import { StatusCode } from '../common/constants';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(id: number, pass: string): Promise<any> {
        const user = await this.usersService.findOne(id);
        if (user && await this.usersService.validatePassword(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: CreateLoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
    
        if (!user || user.password !== loginDto.password) {
            throw new HttpException(
                StatusCode.UNAUTHORIZED.message,
                StatusCode.UNAUTHORIZED.status,
            );
        }
    
        const payload = { email: user.email, sub: user.id };
        return {
            status: true,
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}
