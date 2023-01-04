import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_has_permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().index()
      table.integer('permission_id').unsigned().index()
      table.foreign('user_id').references('id').inTable('users')
        .onUpdate('NO ACTION').onDelete('CASCADE')
      table.foreign('permission_id').references('id').inTable('permissions')
        .onUpdate('NO ACTION').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.dropForeign('permission_id')
    }).dropTable(this.tableName)
  }
}
