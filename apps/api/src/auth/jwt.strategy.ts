import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer token olarak JWT'yi al
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // JWT secret env'den alınıyor
        });
    }

    async validate(payload: any) {
        // Token doğrulandıktan sonra kullanıcı bilgilerini döner
        return { userId: payload.sub, email: payload.email };
    }
}
