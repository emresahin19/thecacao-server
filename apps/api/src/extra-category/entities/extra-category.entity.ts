import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Extra } from '../../extra/entities/extra.entity';
import { Image } from '../../image/entities/image.entity';

@Entity('extras_categories')
export class ExtraCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    
    @Column({ type: 'integer', nullable: true })
    image_id?: number;

    image_url?: string;

    @Column({ type: 'tinyint', default: 0 })
    passive: boolean;

    @Column({ type: 'tinyint', default: 0 })
    deleted: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Extra, (extra) => extra.category)
    extras: Extra[];

    @ManyToOne(() => Image)
    @JoinColumn({ name: 'image_id' })
    image?: Image;

}
