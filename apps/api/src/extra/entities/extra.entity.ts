import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExtraCategory } from '../../extra-category/entities/extra-category.entity';
import { Image } from '../../image/entities/image.entity';
import { MemoryStoredFile } from 'nestjs-form-data';

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
  image?: number;

  @Column({ type: 'simple-json', nullable: true })
  image_ids: number[];
  images?: { id?: number; file?: MemoryStoredFile; fieldname?: string }[];
  image_urls?: string[];

  @Column({ type: 'tinyint', default: 0 })
  passive: boolean;

  @Column({ type: 'tinyint', default: 0 })
  deleted: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => ExtraCategory, (extraCategory) => extraCategory.extras, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: ExtraCategory;

  @Column({ type: 'int', nullable: false })
  category_id: number;
}
