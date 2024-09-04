import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1627848486000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'username',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'image_path',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
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
                    name: 'role',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'reset_password_token',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'reset_password_expires',
                    type: 'datetime',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
