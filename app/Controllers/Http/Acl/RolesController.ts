import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/BaseController'
import Role from 'App/Models/Acl/Role'
import HttpCodes from 'App/Enums/HttpCodes'
import Pagination from 'App/Enums/Pagination'

export default class RolesController extends BaseController {
  public MODEL: typeof Role

  constructor () {
    super()
    this.MODEL = Role
  }

  public async create ({request, response}: HttpContextContract) {
    try {
      const roleExist = await this.MODEL.findBy('name', request.body().name)
      if (roleExist) {
        return response.status(HttpCodes.CONFLICTS).send({message: 'Role already exists!'})
      }
      const role = new this.MODEL()
      role.name = request.input('name')
      const data = await role.save()
      return response.send({status: true, message: 'Role saved!', data})
    } catch (e) {
      console.log(e)
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({status: false, message: e.toString()})
    }
  }

  public async find ({request, response}: HttpContextContract) {
    let baseQuery = this.MODEL.query()
    // if (request.user.isSuperAdmin) {
    //   baseQuery = baseQuery
    // } else if (request.user.isAdmin) {
    //   let roles = ['super admin', 'admin']
    //   baseQuery = baseQuery.orWhereNotIn('name', roles)
    // }
    if (request.input('name')) {
      baseQuery.where('name', 'like', `${request.input('name')}%`)
    }
    return response.send(await baseQuery.paginate(
      request.input(Pagination.PAGE_KEY, Pagination.PAGE),
      request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE),
    ),
    )
  }

  public async update ({request, response}: HttpContextContract) {
    try {
      const role = await this.MODEL.findBy('id', request.param('id'))
      if (!role) {
        return response.status(HttpCodes.NOT_FOUND).send({status: false, message: 'Role does not exists!'})
      }
      const roleTypeExist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()
      if (roleTypeExist) {
        return response.status(HttpCodes.CONFLICTS).send({
          status: false,
          message: `${request.body().name} Role type already exist!`,
        })
      }
      role.name = request.body().name
      await role.save()
      return response.send({status: true, message: 'Role updated!', date: role})
    } catch (e) {
      console.log(e)
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({status: false, message: e.message})
    }
  }
}
