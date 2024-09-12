import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Image } from '../../image/entities/image.entity';
import { Extra } from '../../extra/entities/extra.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string;

    @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
    price: number;

    @Column({ type: 'text', nullable: true })
    recipe: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'simple-json', nullable: true })
    image_ids: number[];  // Assuming image_ids is a JSON array of image IDs

    @Column({ type: 'simple-json', nullable: true })
    extra: number[]; // Assuming extra is a JSON array of extra IDs
    
    images?: Image[];
    image_urls?: Image['url'][];

    @OneToMany(() => Extra, (extra) => extra.id)
    extraItems: Extra[];

    @Column({ type: 'tinyint', default: 0 })
    order: number;

    @Column({ type: 'tinyint', default: 0 })
    passive: boolean;

    @Column({ type: 'tinyint', default: 0 })
    deleted: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
