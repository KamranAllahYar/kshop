import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserHasPermission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public permission_id: number

  @column()
  public name: string
}
