import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ExtraCategory } from '../../extra-category/entities/extra-category.entity';

@Entity('extras')
export class Extra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'tinyint', default: 0 })
  passive: boolean;

  @Column({ type: 'tinyint', default: 0 })
  deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => ExtraCategory, (extraCategory) => extraCategory.id, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ExtraCategory;

  @Column({ name: 'category_id' })
  category_id: number;
}
