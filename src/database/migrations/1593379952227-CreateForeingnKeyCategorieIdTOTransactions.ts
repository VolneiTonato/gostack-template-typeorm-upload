import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateForeingnKeyCategorieIdTOTransactions1593379952227
  implements MigrationInterface {
  private tableName = 'transactions';

  private column = new TableColumn({
    name: 'category_id',
    type: 'uuid',
    isNullable: false,
  });

  private foreingKey = new TableForeignKey({
    columnNames: [this.column.name],
    referencedColumnNames: ['id'],
    referencedTableName: 'categories',
    name: 'fk_categorie_transaction',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);

    await queryRunner.createForeignKey(this.tableName, this.foreingKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreingKey);

    await queryRunner.dropColumn(this.tableName, this.column.name);
  }
}
