import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'variant_values'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('variant_id').unsigned().index()
        .references('id').inTable('product_variants')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('option_id').unsigned().index()
        .references('id').inTable('options')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('value_id').unsigned().index()
        .references('id').inTable('option_values')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('combination_code').unique()
      table.integer('inventory').defaultTo(0).index()
      table.decimal('mrp', 13, 2).defaultTo(0).index();
      table.decimal('price', 13, 2).defaultTo(0).index();
      table.boolean('active').defaultTo(true).index();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.unique(['variant_id', 'option_id', 'value_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('variant_id')
      table.dropForeign('option_id')
      table.dropForeign('value_id')
    }).dropTable(this.tableName)
  }
}
