import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

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
  imageIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  extra: string[];

  @Column({ type: 'simple-json', nullable: true })
  diy: string[];

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
