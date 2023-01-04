import Route from '@ioc:Adonis/Core/Route'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PermissionsController from 'App/Controllers/Http/Acl/PermissionsController'

Route.group(async () => {
  Route.post('/',(ctx: HttpContextContract) => {
    return new PermissionsController().create(ctx)
  })
  Route.put('/:id',(ctx: HttpContextContract) => {
    return new PermissionsController().update(ctx)
  })
  Route.delete('/:id',(ctx: HttpContextContract) => {
    return new PermissionsController().destroy(ctx)
  })

  Route.get('/',(ctx: HttpContextContract) => {
    return new PermissionsController().find(ctx)
  })
  Route.get('/:id',(ctx: HttpContextContract) => {
    return new PermissionsController().get(ctx)
  })
}).prefix('/api/acl/permissions')
