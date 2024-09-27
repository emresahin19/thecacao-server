import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { 
    APP_PORT,
    APP_URL,
    DASH_URL,
} from './common/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS ayarları
    app.enableCors({
        origin: [DASH_URL], // Frontend (Next.js) URL'si (uygun olan URL'yi ekleyin)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true, // Cookie ve kimlik doğrulama bilgilerini aktarmak için gereklidir
    });

    await app.listen(APP_PORT);

    setInterval(async () => {
        try {
            const response = await fetch(`${APP_URL}/menu`);
            console.log('Menu data fetched');
        } catch (error) {
            console.error('Failed to fetch', error);
        }
    }, 60000);
}
bootstrap();
