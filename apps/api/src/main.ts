import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { 
    APP_PORT,
    APP_URL,
    DASH_URL,
    WWW_URL,
} from './common/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [DASH_URL],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true, 
            },
        }),
    );
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
