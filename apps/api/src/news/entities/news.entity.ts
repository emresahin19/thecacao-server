import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, (category) => category.news, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'text' })
    body: string;

    @Column({ name: 'image_path', type: 'varchar', length: 255, nullable: true })
    imagePath: string;

    @Column({ name: 'video_path', type: 'varchar', length: 255, nullable: true })
    videoPath: string;

    @Column({ name: 'related_news_ids', type: 'json', nullable: true })
    relatedNewsIds: number[];

    @ManyToOne(() => User, (user) => user.news, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column({ name: 'word_count', type: 'int', default: 0 })
    wordCount: number;

    @Column({ name: 'show_author', type: 'boolean', default: true })
    showAuthor: boolean;

    @Column({ type: 'int', default: 0 })
    hit: number;

    @Column({ type: 'json', nullable: true })
    shared: Record<string, number>;

    @Column({ name: 'no_comments', type: 'boolean', default: false })
    noComments: boolean;

    @Column({ name: 'no_ads', type: 'boolean', default: false })
    noAds: boolean;

    @Column({ type: 'boolean', default: false })
    hidden: boolean;

    @Column({ name: 'hidden_homepage', type: 'boolean', default: false })
    hiddenHomepage: boolean;

    @Column({ type: 'boolean', default: false })
    passive: boolean;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
