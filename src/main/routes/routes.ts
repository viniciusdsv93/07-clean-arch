import { Request, Response, Router } from "express";
import { makeUserController } from "../factories/user.controller.factory";
import { makeLoginController } from "../factories/login.controller.factory";

const userController = makeUserController();
const loginController = makeLoginController();

const router = Router();

router.post("/insert", async (req: Request, res: Response) => {
  const response = await userController.handle(req);
  return res.status(response.statusCode).send({
    message: response.message,
    user: response.user,
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const response = await loginController.handle(req);
  return res.status(response.statusCode).send({
    message: response.message
  })
})

export { router };
