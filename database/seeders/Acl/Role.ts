import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Acl/Role'
import {DateTime} from 'luxon'

export default class extends BaseSeeder {
  public async run () {
    await Role.createMany([
      {
        name: 'Super Admin',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        name: 'Admin',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        name: 'User',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    ])
  }
}
