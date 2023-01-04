import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthController from 'App/Controllers/Http/AuthController'

Route.group(async () => {
  Route.post('/register', (ctx: HttpContextContract) => {
    return new AuthController().register(ctx)
  })
  Route.post('/login', (ctx: HttpContextContract) => {
    return new AuthController().login(ctx)
  })
  Route.post('/verify-otp', (ctx: HttpContextContract) => {
    return new AuthController().verifyOtp(ctx)
  })

  Route.post('/resend-otp', (ctx: HttpContextContract) => {
    return new AuthController().resendOtp(ctx)
  })

  Route.post('/confirm-reset-password', (ctx: HttpContextContract) => {
    return new AuthController().resetPasswordUsingOldPassword(ctx)
  }).middleware(['auth:api'])

  Route.post('/email-verification', (ctx: HttpContextContract) => {
    return new AuthController().emailVerification(ctx)
  })
}).prefix('/api/auth')
