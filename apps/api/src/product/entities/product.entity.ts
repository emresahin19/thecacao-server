import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Image } from '../../image/entities/image.entity';
import { Extra } from '../../extra/entities/extra.entity';
import { ExtraCategory } from '../../extra-category/entities/extra-category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'int', nullable: false })
    category_id: number;

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
    image_ids: number[];
    images?: Image[];
    image?: Image;

    @Column({ type: 'simple-json', nullable: true })
    extra: number[]; 
        
    @OneToMany(() => Extra, (extra) => extra.id)
    extras: ExtraCategory[];

    @Column({ type: 'tinyint', default: 0 })
    order: number;

    @Column({ type: 'tinyint', default: 0 })
    passive: boolean;

    @Column({ type: 'tinyint', default: 0 })
    deleted: boolean;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
