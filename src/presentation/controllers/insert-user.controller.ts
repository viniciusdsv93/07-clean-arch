import { IInsertUser } from "src/domain/usecases/insert.user";

export class UserController {
  constructor(private readonly insertUser: IInsertUser) { }

  async handle(request: any) {
    const requiredFields = ["name", "password", "password_confirmation"];
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return {
          statusCode: 400,
          message: `${field} is a required field`,
        };
      }
    }

    const { name, password, password_confirmation } = request.body;

    if (password.length < 6) {
      return {
        statusCode: 400,
        message: "password must have at least 6 characters",
      };
    }

    if (password !== password_confirmation) {
      return {
        statusCode: 400,
        message: "password and password_confirmation did not match",
      };
    }

    const result = await this.insertUser.execute({ name, password });

    if (result) {
      return {
        statusCode: 201,
        message: "User successfully inserted",
        user: { ...result, password: undefined },
      };
    }
    return {
      statusCode: 500,
      message: "Something went wrong",
    };
  }
}
