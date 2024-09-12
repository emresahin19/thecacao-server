import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer token olarak JWT'yi al
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // JWT secret env'den alınıyor
        });
    }

    async validate(payload: any) {
        // JWT'den gelen payload (sub: user id)
        const user = await this.userService.findOne(payload.sub); // UserService ile user'ı alıyoruz
        if (!user) {
          throw new Error('Unauthorized');
        }
        return user; // Kullanıcıyı geri döndürüyoruz
    }
}
