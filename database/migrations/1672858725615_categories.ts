import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('parent').unsigned()
        .nullable().index()
        .references('id').inTable('categories')
        .onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('name').index()
      table.string('slug').unique()
      table.string('meta_title').nullable()
      table.string('meta_description').nullable()
      table.boolean('active').defaultTo(false).index()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('parent')
    }).dropTable(this.tableName)
  }
}
