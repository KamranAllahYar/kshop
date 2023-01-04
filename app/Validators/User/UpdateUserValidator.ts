import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    email: schema.string.optional([
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: {
          id: this.ctx.request.param('id'),
        },
      }),
    ]),
    password: schema.string.optional(),
    roles: schema.array.optional().members(
      schema.string(),
    ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'email.string': 'Email field must be of data type string',
    'email.email': 'Email field must be valid email',
    'email.unique': 'Email is already in use',
    'first_name.string': 'First Name field must be of data type string',
    'last_name.string': 'Last Name field must be of data type string',
    'last_name.password': 'Last Name field must be of data type string',
    'roles.array': 'Roles field must be an array of strings',
    'roles.*.string': '{{ field }} must be of data type string',
  }
}
