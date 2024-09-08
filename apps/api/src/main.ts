import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { 
  APP_PORT,
  APP_URL,
} from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(APP_PORT);

  setInterval(() => {
    try {
      fetch(`${APP_URL}/menu`);
      console.log('Menu data fetched');
    } catch (error) {
      console.error('Failed to fetch', error);
    }
  }, 60000);
}
bootstrap();
