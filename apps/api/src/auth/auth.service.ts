import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'

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

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
    
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }
    
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
