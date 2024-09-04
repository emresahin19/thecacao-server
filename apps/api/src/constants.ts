import * as dotenv from 'dotenv';

dotenv.config();

export const DATABASE_NAME = process.env.DB_NAME || 'base';
export const DATABASE_HOST = process.env.DB_HOST || 'localhost';
export const DATABASE_PORT = parseInt(process.env.DB_PORT) || 3306;
export const DATABASE_USERNAME = process.env.DB_USERNAME || 'root';
export const DATABASE_PASSWORD = process.env.DB_PASSWORD || 'supersecretpassword';

export const APP_PORT = process.env.API_PORT || 4040;
export const APP_URL = process.env.API_URL || 'http://localhost:4040';
export const APP_DOMAIN = process.env.API_DOMAIN || 'localhost:4040';