import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserHasRole from '../../../app/Models/Acl/UserHasRole'

export default class extends BaseSeeder {
  public async run () {
    await UserHasRole.createMany([
      {
        user_id: 1,
        role_id: 1,
      },
    ])
  }
}
