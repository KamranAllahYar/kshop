import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommonMessages from '../CommonMessages'

export default class OldPasswordResetValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    oldPassword: schema.string(),
    password: schema.string([
      rules.confirmed('confirmPassword')
    ]),
  })

  public messages: CustomMessages = CommonMessages
}
