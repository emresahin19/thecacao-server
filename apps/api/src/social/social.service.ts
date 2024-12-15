import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SocialService {
    private appId: string;
    private appSecret: string;
    private redirectUri: string;
    // Bu örnekte token'ı hafızada tutuyoruz, prod'da DB veya secure storage kullanın.
    private longLivedAccessToken: string;

    constructor(private readonly configService: ConfigService) {
        this.appId = this.configService.get<string>('INSTAGRAM_APP_ID');
        this.appSecret = this.configService.get<string>('INSTAGRAM_APP_SECRET');
        this.redirectUri = this.configService.get<string>('INSTAGRAM_REDIRECT_URI');
    }

    /**
     * Kullanıcıyı Instagram izin ekranına yönlendirmek için gerekli URL'yi döner.
     */
    getInstagramAuthUrl(): string {
        const scope = 'user_profile,user_media';
        return `https://api.instagram.com/oauth/authorize?client_id=${this.appId}&redirect_uri=${this.redirectUri}&scope=${scope}&response_type=code`;
    }

    /**
     * Callback aşamasında, code parametresini kullanarak short-lived token alır.
     * Ardından long-lived token'a çevirir ve saklar.
     */
    async exchangeCodeForToken(code: string): Promise<void> {
        try {
            // Short-lived token alımı
            const shortLivedResponse = await axios.post(
                'https://api.instagram.com/oauth/access_token',
                new URLSearchParams({
                    client_id: this.appId,
                    client_secret: this.appSecret,
                    grant_type: 'authorization_code',
                    redirect_uri: this.redirectUri,
                    code: code,
                }),
            );

            const shortLivedAccessToken = shortLivedResponse.data.access_token;

            // Long-lived token alımı
            const longLivedResponse = await axios.get(
                `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.appSecret}&access_token=${shortLivedAccessToken}`
            );

            this.longLivedAccessToken = longLivedResponse.data.access_token;
        } catch (error) {
            throw new HttpException(
                'Instagram Access Token alırken hata oluştu: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * Long-lived access token mevcutsa medya öğelerini çeker.
     * Her bir medya için temel bilgileri (id, caption, media_url, media_type) döner.
     */
    async getUserMedia(): Promise<any> {
        if (!this.longLivedAccessToken) {
            throw new HttpException('Önce token alınmalı.', HttpStatus.FORBIDDEN);
        }

        // Kullanıcı ID'si çekme
        const userResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${this.longLivedAccessToken}`);
        const userId = userResponse.data.id;

        // Medya çekme
        const mediaResponse = await axios.get(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,thumbnail_url,media_type,permalink&access_token=${this.longLivedAccessToken}`);

        return mediaResponse.data;
    }
}
