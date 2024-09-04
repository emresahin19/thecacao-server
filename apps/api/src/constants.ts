import * as dotenv from 'dotenv';

dotenv.config();

export const DB_DATABASE = process.env.DB_DATABASE || 'base';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
export const DB_USERNAME = process.env.DB_USERNAME || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'supersecretpassword';

export const APP_PORT = process.env.API_PORT || 4040;
export const APP_URL = process.env.API_URL || 'http://localhost:4040';
export const APP_DOMAIN = process.env.API_DOMAIN || 'localhost:4040';