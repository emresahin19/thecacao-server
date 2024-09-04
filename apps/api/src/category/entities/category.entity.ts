import { News } from '../../news/entities/news.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    type: string;

    @Column({ type: 'int', default: 0 })
    priority: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ name: 'show_at_home', type: 'boolean', default: false })
    showAtHome: boolean;

    @Column({ name: 'show_at_menu', type: 'boolean', default: false })
    showAtMenu: boolean;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'boolean', default: false })
    passive: boolean;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @Column({ type: 'json', nullable: true })
    tags: string[];

    @Column({ type: 'json', nullable: true })
    keywords: string[];

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => News, (news) => news.category)
    news: News[];
}
