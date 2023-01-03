import { Application } from "express";
import { cors } from "../middlewares/cors";

export const setupApp = (app: Application): void => {
    app.disable('x-powered-by');
    app.use(cors);
}