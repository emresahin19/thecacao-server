import { NestFactory } from '@nestjs/core';
import { NewsSeederService } from './seeder/news-seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';
import { CategorySeederService } from './seeder/category-seeder/seeder.service';
import { UserSeederService } from './seeder/user-seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const categorySeeder = app.get(CategorySeederService);
  await categorySeeder.run();

  const userSeeder = app.get(UserSeederService);
  await userSeeder.run();

  const newsSeeder = app.get(NewsSeederService);
  await newsSeeder.run();

  await app.close();
}

bootstrap();
