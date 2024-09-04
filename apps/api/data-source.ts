import { DataSource } from 'typeorm';
import {
    dbName,
    dbHost,
    dbPort,
    dbUsername,
    dbPassword,
} from '@asim-ui/constants';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
});