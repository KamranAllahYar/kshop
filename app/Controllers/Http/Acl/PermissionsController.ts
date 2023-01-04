import BaseController from 'App/Controllers/BaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import HttpCodes from 'App/Enums/HttpCodes'
import Permission from 'App/Models/Acl/Permission'

export default class PermissionsController extends BaseController{
  public MODEL: typeof Permission
  constructor () {
    super()
    this.MODEL = Permission
  }
  public async update ({request, response}: HttpContextContract) {
    try {
      const permission = await this.MODEL.findBy('id', request.param('id'))
      if (!permission) {
        return response.status(HttpCodes.NOT_FOUND).send({status: false, message: 'Permission does not exists!'})
      }
      const permissionExists = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()
      if (permissionExists) {
        return response.status(HttpCodes.CONFLICTS).send({
          status: false,
          message: `${request.body().name} permission already exist!`,
        })
      }
      permission.name = request.body().name
      await permission.save()
      return response.send({status: true, message: 'Permission updated!', date: permission})
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({status: false, message: e.message})
    }
  }

  public async create ({request, response}: HttpContextContract) {
    try {
      const permissionExists = await this.MODEL.findBy('name', request.body().name)
      if (permissionExists) {
        return response.conflict({message: 'Permission already exists!'})
      }
      const permission = new this.MODEL()
      permission.name = request.input('name')
      const data = await permission.save()
      return response.send({status: true, message: 'Permission saved!', data})
    } catch (e) {
      console.log(e)
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({status: false, message: e.toString()})
    }
  }
}
