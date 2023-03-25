import { IInsertUser, InsertUserModel } from "src/domain/usecases/insert.user";
import { UserController } from "./insert-user.controller";
import { UserModel } from "src/domain/models/user";

describe("Insert User Controller", () => {
  type SutTypes = {
    sut: UserController;
    insertUser: IInsertUser;
  };

  const makeInsertUserStub = (): IInsertUser => {
    class InsertUserStub implements IInsertUser {
      async execute(insertUserModel: InsertUserModel): Promise<UserModel> {
        return new Promise((resolve) => {
          resolve({
            id: "fake_id",
            name: "fake_name",
            password: "fake_password",
          });
        });
      }
    }
    return new InsertUserStub();
  };

  const makeSut = (): SutTypes => {
    const insertUser = makeInsertUserStub();
    const sut = new UserController(insertUser);

    return { sut, insertUser };
  };

  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        password: "fake_password",
        password_confirmation: "fake_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({ statusCode: 400, message: "name is a required field" });
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
        password_confirmation: "fake_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 400,
      message: "password is a required field",
    });
  });

  test("Should return 400 if no password confirmation is provided", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "fake_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 400,
      message: "password_confirmation is a required field",
    });
  });

  test("Should return 400 if a password with less than 6 characters is provided", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "short",
        password_confirmation: "fake_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 400,
      message: "password must have at least 6 characters",
    });
  });

  test("Should return 400 if password and password_confirmation do not match", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "fake_password",
        password_confirmation: "another_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 400,
      message: "password and password_confirmation did not match",
    });
  });

  test("Should call InsertUser with the correct values", async () => {
    const { sut, insertUser } = makeSut();
    const insertUserStubSpy = jest.spyOn(insertUser, "execute");
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "fake_password",
        password_confirmation: "fake_password",
      },
    };
    await sut.handle(fakeRequest);
    expect(insertUserStubSpy).toHaveBeenCalledWith({
      name: "fake_name",
      password: "fake_password",
    });
  });

  test("Should return 201 on success", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "fake_password",
        password_confirmation: "fake_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 201,
      message: "User successfully inserted",
      user: {
        id: "fake_id",
        name: "fake_name",
      },
    });
  });
});
