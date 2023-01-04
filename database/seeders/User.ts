import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import {DateTime} from 'luxon'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        phone: '923407083077',
        password: '12345678',
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      }
    ])
  }
}
