import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactions1593378327972
  implements MigrationInterface {
  private table = new Table({
    name: 'transactions',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'title',
        type: 'varchar',
        length: '100',
        isNullable: false,
      },
      {
        name: 'value',
        type: 'decimal',
        default: '0.00',
        precision: 10,
        scale: 2,
        isNullable: false,
      },
      {
        name: 'type',
        type: 'enum',
        enum: ['income', 'outcome'],
        enumName: 'typeEnum',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      },

      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table.name);
  }
}
