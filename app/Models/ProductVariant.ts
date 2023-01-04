import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProductVariant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public variantId: number

  @column()
  public optionId: number

  @column()
  public valueId: number

  @column()
  public combinationCode: string

  @column()
  public inventory: number

  @column()
  public mrp: number

  @column()
  public price: number

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
