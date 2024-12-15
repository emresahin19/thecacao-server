import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
    ],
    providers: [
        SocialService,
    ],
    controllers: [
        SocialController,
    ],
})
export class SocialModule { }
