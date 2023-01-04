import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from "App/Controllers/BaseController";
import User from "App/Models/User";
import Role from "App/Models/Acl/Role";
import { sendOtp } from "App/Helpers/OtpHelper";
import SignupUserValidator from "App/Validators/User/SignupUserValidator";
import { DateTime } from "luxon";
import ResponseMessages from 'App/Enums/ResponseMessages';
import Hash from '@ioc:Adonis/Core/Hash'
import OldPasswordResetValidator from 'App/Validators/User/OldPasswordResetValidator';

export default class AuthController extends BaseController {
  public MODEL: typeof User

  constructor() {
    super();
    this.MODEL = User;
  }

  public async register({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(SignupUserValidator)
    try {
      let user = await this.MODEL.findBy('phone', payload.phone);
      if (user && !user.isPhoneVerified) {
        delete user.$attributes.password
        await sendOtp(session, payload.phone).then();
        return response.conflict({
          status: false,
          message: 'Already exists',
          data: { user: user, verified: false }
        })
      }
      user = await this.MODEL.create(payload)
      const adminRole = await Role.findBy('name', 'user');
      if (adminRole) {
        user.related('roles').sync([adminRole.id])
      }
      delete user.$attributes.password
      await sendOtp(session, payload.phone);
      return response.send({ status: true, message: 'User signedup successfully', data: user });
    } catch (e) {
      console.log(e.toString());
      return response.internalServerError({ status: false, message: e.toString() });
    }
  }

  public async resendOtp({ }: HttpContextContract) {
  }

  public async verifyOtp({ auth, request, session, response }: HttpContextContract) {
    try {
      const signup = session.get('signup');
      if (!signup) {
        return response.notAcceptable({ status: false, message: 'Please regenerate otp!' });
      }
      if (DateTime.fromISO(signup.maxAge) < DateTime.now()) {
        return response.notAcceptable({ status: false, message: 'Otp code expired. Please regenerate otp!' });
      }
      if (request.input('otp') === signup.code) {
        let user = await this.MODEL.findBy('email', signup.email);
        if (!user) {
          return response.notFound({ status: false, message: 'User not found!' });
        }
        user.isPhoneVerified = true;
        await user.save();
        delete user.$attributes.password;
        // delete req.session.signup
        const token = await auth.use('api').loginViaId(user.id);
        session.forget('signup');
        return response.send({
          status: true, message: 'Otp verified!',
          data: {
            user,
            token
          },
        })
      }
      return response.notAcceptable({ status: false, message: 'Invalid otp!' })
    } catch (e) {
      console.log(e.toString());
      return response.internalServerError({ status: false, message: e.toString() })
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const token = await auth.use('api').attempt(request.input('phone'), request.input('password'))
      return {
        data: {
          user: auth.user,
          token: token.token,
        },
      }
    } catch (e) {
      console.log(e)
      return response.badRequest('Invalid credentials')
    }
  }

  public async emailVerification({ }: HttpContextContract) {
  }

  public async resetPasswordUsingOldPassword({ auth, request, response }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED })
    }
    const payload = await request.validate(OldPasswordResetValidator)
    const passwordMatched = await Hash.verify(auth.user.password, payload.oldPassword)
    if (passwordMatched) {
      const user = await User.findBy('id', auth.user.id);
      if (user) {
        await user.merge({
          password: payload.password
        }).save();
        return response.send({ message: 'Password changed' })
      }
      return response.notFound({ message: 'User' })
    }
    return response.notAcceptable({ message: 'Wrong password' })
  }

  public async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout()
  }


  public async isSessionAuth({ }: HttpContextContract) {

  }
}
