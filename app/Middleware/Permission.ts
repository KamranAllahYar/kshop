import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ResponseMessages from 'App/Enums/ResponseMessages'

export default class Permission {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>, permissions: []) {
    let rolePermissions: string[] = []
    if (auth.user?.roles) {
      for (const role of auth.user.roles) {
        rolePermissions = [...role.permissions.map(permission => permission.name)]
      }
    }
    let userPermissions = auth.user?.permissions.map(permission => permission.name) || []
    userPermissions = [...userPermissions,...rolePermissions]
    if (!userPermissions.some(permission => {
      return permissions.some(requiredPermission => permission === requiredPermission)
    })) {
      return response.forbidden({message: ResponseMessages.FORBIDDEN})
    }
    await next()
  }
}
