import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {BaseModel} from '@ioc:Adonis/Lucid/Orm'
import HttpCodes from 'App/Enums/HttpCodes'
import pagination from 'App/Enums/Pagination'
import User from 'App/Models/User'
import _ from 'lodash'

export default class BaseController {
  public MODEL: typeof BaseModel

  public toJSON (payload) {
    if (typeof payload === 'string') {
      return JSON.parse(payload)
    }
    return JSON.parse(JSON.stringify(payload))
  }

  public async get ({request, response}: HttpContextContract) {
    try {
      const data = await this.MODEL.findBy('id', request.param('id'))
      return response.send({status: true, data: data || {}})
    } catch (e) {
      return response.status(HttpCodes.SERVER_ERROR).send({status: false, message: e.toString()})
    }
  }

  public async create ({request, response}: HttpContextContract) {
    const results = await this.MODEL.create(request.body())
    return response.send(results)
  }

  public async update ({request, response}: HttpContextContract) {
    const result = await this.MODEL.findBy('id', request.param('id'))
    if (!result) {
      return response.status(HttpCodes.NOT_FOUND).send({
        status: false, message: 'Record Not Found',
      })
    }
    const updatedResult = await result.merge(request.body()).save()
    return response.send({
      status: true,
      message: 'Record Updated',
      data: updatedResult,
    })
  }

  public async destroy ({request, response}: HttpContextContract) {
    const result = await this.MODEL.findBy('id', request.param('id'))
    if (!result) {
      return response.status(HttpCodes.NOT_FOUND).send({
        status: false,
        message: 'Record Not Found',
      })
    }
    await result.delete()
    return response.send({
      status: true,
      message: 'Record Deleted',
      data: result,
    })
  }

  public async find ({request, response}: HttpContextContract) {
    let baseQuery = this.MODEL.query()
    if (request.input('name')) {
      baseQuery.where('name', 'like', `${request.input('name')}%`)
    }
    if (request.input('is_active')) {
      baseQuery.where('is_active', request.input('is_active'))
    }
    return response.send(await baseQuery
      .paginate(
        request.input(pagination.PAGE_KEY, pagination.PAGE),
        request.input(pagination.PER_PAGE_KEY, pagination.PER_PAGE),
      ),
    )
  }

  public checkRole (user?: User, role?: string) {
    if (user?.roles && user.roles.length) {
      const roles = user.roles.filter(userRole => userRole.name === role)
      return roles.length > 0
    }
    return false
  }

  public isAdmin (user?: User) {
    return this.checkRole(user, 'admin')
  }

  public isSuperAdmin (user?: User) {
    return this.checkRole(user, 'super admin')
  }

  public allPermissions (user?: User){
    let rolePermissions: string[] = []
    if (user?.roles) {
      for (const role of user.roles) {
        rolePermissions = [...role.permissions.map(permission => permission.name)]
      }
    }
    let userPermissions = user?.permissions.map(permission => permission.name) || []

    return _.uniq([...userPermissions,...rolePermissions])
  }
}
