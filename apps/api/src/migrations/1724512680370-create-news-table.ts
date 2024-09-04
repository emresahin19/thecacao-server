import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateNewsTable1724512680370 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('Creating news table...');
        await queryRunner.createTable(new Table({
            name: 'news',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'category_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'slug',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'image_path',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'video_path',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'related_news_ids',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'tags',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'keywords',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'author_id',
                    type: 'int',
                    isNullable: false,
                    foreignKeyConstraintName: 'FK_author_id',
                },
                {
                    name: 'word_count',
                    type: 'int',
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'show_author',
                    type: 'boolean',
                    isNullable: false,
                    default: true,
                },
                {
                    name: 'hit',
                    type: 'int',
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'shared',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'no_comments',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'no_ads',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'hidden',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'hidden_homepage',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'passive',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'deleted',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'created_at',
                    type: 'datetime',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'datetime',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));

        await queryRunner.createForeignKey('news', new TableForeignKey({
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('news', new TableForeignKey({
            columnNames: ['author_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('news');
    }
}
