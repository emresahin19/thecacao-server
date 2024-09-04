import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import {
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD
} from './src/constants';

dotenv.config({ path: path.resolve('.env') });

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
});