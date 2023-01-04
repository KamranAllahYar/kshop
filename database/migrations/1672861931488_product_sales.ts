import BaseSchema from '@ioc:Adonis/Lucid/Schema'

module.exports = class extends BaseSchema {
  protected tableName = 'product_sales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('product_id').unsigned().index()
        .references('id').inTable('products')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('variant_value_id').unsigned().index()
        .references('id').inTable('variant_values')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.decimal('sale_price', 13, 2).defaultTo(0);
      table.timestamp('sale_start_time').index();
      table.timestamp('sale_end_time').index();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.unique(['product_id', 'variant_value_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('product_id')
      table.dropForeign('variant_value_id')
    }).dropTable(this.tableName)
  }
}
