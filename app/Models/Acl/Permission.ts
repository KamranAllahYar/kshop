import { DateTime } from 'luxon'
import {BaseModel, beforeSave, column} from '@ioc:Adonis/Lucid/Orm'

export default class Permission extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public name: string

  @column.dateTime({autoCreate: true})
  public created_at: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updated_at: DateTime

  @beforeSave()
  public static async lowerCaseName (permission: Permission) {
    if (permission.$dirty.name) {
      if (permission.name) {
        permission.name = permission.name.toLowerCase()
      }
    }
  }
}
