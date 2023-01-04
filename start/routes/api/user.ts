import Route from '@ioc:Adonis/Core/Route'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UsersController from 'App/Controllers/Http/UsersController'

Route.group(async () => {
  Route.get('/authenticated',(ctx: HttpContextContract) => {
    return new UsersController().authenticated(ctx)
  })
  Route.post('/',(ctx: HttpContextContract) => {
    return new UsersController().create(ctx)
  })
  Route.put('/:id',(ctx: HttpContextContract) => {
    return new UsersController().update(ctx)
  })
  Route.delete('/:id',(ctx: HttpContextContract) => {
    return new UsersController().destroy(ctx)
  })

  Route.get('/',(ctx: HttpContextContract) => {
    return new UsersController().find(ctx)
  })
  Route.get('/:id',(ctx: HttpContextContract) => {
    return new UsersController().get(ctx)
  })
}).middleware(['auth:api']).prefix('/api/users')
