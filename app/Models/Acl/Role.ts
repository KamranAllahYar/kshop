import {DateTime} from 'luxon'
import {BaseModel, beforeSave, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Permission from 'App/Models/Acl/Permission'

export default class Role extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public name: string

  @column.dateTime({autoCreate: true})
  public created_at: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updated_at: DateTime

  // Relations
  @manyToMany(() => Permission, {
    pivotTable: 'role_has_permissions',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  public permissions: ManyToMany<typeof Permission>

  @beforeSave()
  public static async lowerCaseName (role: Role) {
    if (role.$dirty.name) {
      if (role.name) {
        role.name = role.name.toLowerCase()
      }
    }
  }
}
