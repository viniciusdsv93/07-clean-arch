import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.split(" ")[1]) {
    return res.status(401).send({
      message: "Unauthorized"
    })
  }

  const token = authorization.split(" ")[1];

  try {
    jwt.verify(token, "s3cr3t");
    return next();
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized"
    })
  }
}
