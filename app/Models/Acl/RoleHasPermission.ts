import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class RoleHasPermission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public role_id: number

  @column()
  public permission_id: number

  @column()
  public name: string
}
