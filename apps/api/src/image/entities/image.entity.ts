import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cf_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    filename: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    path: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    variant: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
