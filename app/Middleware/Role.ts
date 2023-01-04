import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ResponseMessages from 'App/Enums/ResponseMessages'

export default class Role {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>, roles: []) {
    if (!auth.user?.roles.some(role => {
      return roles.some(requiredRole => role.name === requiredRole)
    })) {
      return response.forbidden({message: ResponseMessages.FORBIDDEN})
    }
    await next()
  }
}
