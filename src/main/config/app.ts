import express, { Application } from "express";
import { router } from "../routes/routes";

class App {
  express: Application;
  port: string | number;

  constructor() {
    this.express = express();
    this.port = process.env.PORT || 3334;
    this.middlewares();
    this.routes();
    this.listen();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(router);
  }

  listen() {
    this.express.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

export { App };
