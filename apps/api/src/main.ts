import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { 
  APP_PORT,
} from './constants';

dotenv.config({ path: path.resolve('.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(APP_PORT);
}
bootstrap();
