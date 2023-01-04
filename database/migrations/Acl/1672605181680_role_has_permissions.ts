import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_has_permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().index()
      table.integer('permission_id').unsigned().index()
      table.foreign('role_id').references('id').inTable('roles')
        .onUpdate('NO ACTION').onDelete('CASCADE')
      table.foreign('permission_id').references('id').inTable('permissions')
        .onUpdate('NO ACTION').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('role_id')
      table.dropForeign('permission_id')
    }).dropTable(this.tableName)
  }
}
