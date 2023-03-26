import { Request, Response, Router } from "express";
import { makeUserController } from "../factories/user.controller.factory";
import { makeLoginController } from "../factories/login.controller.factory";
import { authMiddleware } from "../middlewares/auth/auth.middleware";

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

router.get("/private", authMiddleware, (req: Request, res: Response) => {
  return res.status(200).send({
    message: "Congratulations, you are authenticated"
  })
})

export { router };
