import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
    lastName: string;

    @Column({ name: 'image_path', type: 'varchar', length: 255, nullable: true })
    imagePath: string;

    @Column({ type: 'boolean', default: false })
    passive: boolean;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    role: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ name: 'reset_password_token', type: 'varchar', length: 255, nullable: true })
    resetPasswordToken: string;

    @Column({ name: 'reset_password_expires', type: 'datetime', nullable: true })
    resetPasswordExpires: Date;
}
