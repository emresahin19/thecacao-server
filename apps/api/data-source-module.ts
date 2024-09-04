require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

module.exports = AppDataSource;
