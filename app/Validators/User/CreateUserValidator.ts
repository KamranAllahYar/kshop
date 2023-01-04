import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string([
      rules.alphaNum(),
    ]),
    last_name: schema.string(),
    email: schema.string([
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
    password: schema.string(),
    roles: schema.array.optional().members(
      schema.string(),
    ),
  })

  public messages: CustomMessages = {
    'required':'{{ field }} is required',
    'string':'{{ field }} field must be of data type string',
    'first_name.alpha':'{{ field }} field can only contain alphabets',
    'last_name.alpha':'{{ field }} field can only contain alphabets',
    'email.email': '{{ field }} field must be valid email',
    'email.unique': '{{ field }} is already in use',
    'last_name.password': '{{ field }} field must be of data type string',
    'roles.array': '{{ field }} must be an array of strings',
  }
}
