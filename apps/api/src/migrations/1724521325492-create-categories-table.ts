import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoryTable1627848486000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'categories',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'type',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'priority',
                    type: 'int',
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'slug',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'show_at_home',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'show_at_menu',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'order',
                    type: 'int',
                    isNullable: false,
                    default: 0,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('categories');
    }
}
