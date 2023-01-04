import { Application } from "express";
import { loginRouter } from "../routes/login-routes";
import { Router } from "express";

export const setupRoutes = (app: Application): void => {
    const router = Router();
    app.use('/api', router);
    loginRouter(router);
};