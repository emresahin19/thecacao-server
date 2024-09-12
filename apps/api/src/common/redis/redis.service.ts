import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    private client;

    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.client = createClient({
                url: 'redis://localhost:6379', // Redis sunucunuzun bağlantı adresi ve portu
            });

            this.client.on('error', (err: any) => console.error('Redis Client Error', err));

            this.client.connect().then(() => {
                console.log('Connected to Redis');
            });
        }
    }

    async get(key: string): Promise<any> {
        if (process.env.NODE_ENV !== 'production') {
            return null;
        }
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        await this.client.set(key, JSON.stringify(value), 'EX', ttl); // TTL: 1 saat (3600 saniye)
    }
}
