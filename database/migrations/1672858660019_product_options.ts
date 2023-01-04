import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('product_id').unsigned().index()
        .references('id').inTable('products')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('option_id').unsigned().index()
        .references('id').inTable('options')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('product_id')
      table.dropForeign('option_id')
    }).dropTable(this.tableName)
  }
}
