import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    color: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    textColor: string;

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

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}