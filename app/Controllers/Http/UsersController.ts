import BaseController from 'App/Controllers/BaseController'
import User from 'App/Models/User'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import HttpCodes from 'App/Enums/HttpCodes'
import ResponseMessages from 'App/Enums/ResponseMessages'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import CreateUserValidator from 'App/Validators/User/CreateUserValidator'
import Role from 'App/Models/Acl/Role'
import Database from '@ioc:Adonis/Lucid/Database'
import pagination from 'App/Enums/Pagination'
import UserHasRole from 'App/Models/Acl/UserHasRole'
import {s3Link} from 'App/Helpers/MainHelpers'

export default class UsersController extends BaseController {
  public MODEL: typeof User

  constructor () {
    super()
    this.MODEL = User
  }

  public async create ({request, response}: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)
    const results = await this.MODEL.create(payload)
    delete results.$attributes.password
    return response.send(results)
  }

  public async get ({request, response}: HttpContextContract) {
    try {
      const data = await this.MODEL.findBy('id', request.param('id'))
      if (data) {
        delete data.$attributes.password
      }
      return response.send({status: true, data: data || {}})
    } catch (e) {
      return response.status(HttpCodes.SERVER_ERROR).send({status: false, message: e.toString()})
    }
  }

  public async update ({auth, request, response}: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)
    const exists = await this.MODEL.findBy('id', request.param('id'))
    if (!exists) {
      return response.notFound({status: false, message: ResponseMessages.NOT_FOUND})
    }

    // check to see if a user is eligible to update
    const user = auth.user
    if (!(this.isSuperAdmin(user) || this.isAdmin(user) || user?.id === exists.id)) {
      return response.forbidden({status: false, message: ResponseMessages.FORBIDDEN})
    }
    await exists.merge(payload).save()
    if (payload.roles) {
      const roles: Role[] = await Role.query().whereIn('name', payload.roles)
      exists.related('roles').sync(roles.map(role => role.id))
    }
    delete exists.$attributes.password
    return response.send({status: true, message: 'User updated', data: exists})
  }

  public async find ({auth, request, response}: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized({message: ResponseMessages.UNAUTHORIZED})
    }
    try {
      let baseQuery = Database.from('users')
        .select(
          'users.id',
          'parent_user_id',
          'first_name',
          'last_name',
          'email',
          'company_profiles.logo as company_logo',
          'company_profiles.name as company_name',
          'company_profiles.information',
          'company_profiles.created_at as company_create',
          'users.created_at',
        )
        .leftOuterJoin('company_profiles', 'company_profiles.user_id', '=', 'users.id')
        .where('users.id', '!=', auth.user.id)
      if (this.isAdmin(auth.user)){
        baseQuery.where('parent_user_id',auth.user.id)
      }
      const roles = request.input('roles')
      if (roles && roles.length && !roles.includes('')) {
        baseQuery.whereExists(function (query) {
          query.select('*')
            .from('roles')
            .join('user_has_roles', 'roles.id', '=', 'user_has_roles.role_id')
            .whereRaw('user_has_roles.user_id = users.id')
            .whereIn('roles.name', roles)
        })
      }
      const usersList = (await baseQuery
        .paginate(
          request.input(pagination.PAGE_KEY, pagination.PAGE),
          request.input(pagination.PER_PAGE_KEY, pagination.PER_PAGE),
        )).toJSON()
      const userIds = usersList.data.map((item) => item.id)
      const userRoles = await UserHasRole
        .query()
        .select('roles.id as role_id', 'roles.name', 'user_has_roles.user_id')
        .join('roles', 'roles.id', '=', 'user_has_roles.role_id')
        .whereIn('user_has_roles.user_id', userIds)
      for (const user of usersList.data) {
        user.company_logo = s3Link(user.company_logo)
        delete user.password
        user.roles = userRoles
          .filter((item) => item.user_id === user.id)
          .map((item) => {
            return {
              role_id: item.role_id, name: item.name,
            }
          })
      }
      return response.send(usersList)
    } catch (e) {
      return response.internalServerError({status: false, message: e.toString()})
    }
  }

  public async authenticated ({auth, response}: HttpContextContract) {
    const authenticatedUser = auth.user
    if (!authenticatedUser) {
      return response.unauthorized({message: ResponseMessages.UNAUTHORIZED})
    }
    delete authenticatedUser.$attributes.password
    return response.send({status: true, data: auth.user})
  }
}
