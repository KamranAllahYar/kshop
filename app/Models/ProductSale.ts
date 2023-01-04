import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProductSale extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number

  @column()
  public variantValueId: number | null

  @column()
  public salePrice: number

  @column()
  public saleStartTime: DateTime

  @column()
  public saleEndTime: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
