import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class UserSeederService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async run() {
        const users = [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: 'hashed_password',  // Parolayı hashlemeyi unutmayın
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                passive: false,
                deleted: false,
            },
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'hashed_password',  // Parolayı hashlemeyi unutmayın
                firstName: 'John',
                lastName: 'Doe',
                role: 'user',
                passive: false,
                deleted: false,
            },
            // Diğer kullanıcılar...
        ];

        await this.userRepository.save(users);
        console.log('Users seeding completed.');
    }
}
