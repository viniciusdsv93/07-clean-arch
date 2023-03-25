import { ILoginUser } from "src/domain/usecases/login.user";

export class LoginUserController {

  constructor(private readonly loginUserService: ILoginUser) { }

  async handle(request: any) {

    const requiredFields = ["name", "password"];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return {
          statusCode: 400,
          message: `${field} is a required field`
        }
      }
    }
    const { name, password } = request.body

    const user = await this.loginUserService.execute({
      name,
      password
    })

    if (!user) {
      return {
        statusCode: 403,
        message: "Invalid credentials"
      }
    }
    return {
      statusCode: 200,
      message: "Access granted"
    }
  }
}
