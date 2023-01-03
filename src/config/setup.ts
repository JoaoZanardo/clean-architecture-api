import { Application } from "express";
import { jsonParser } from "../middlewares/json-parser";
import { cors } from "../middlewares/cors";

export const setupApp = (app: Application): void => {
    app.disable('x-powered-by');
    app.use(cors);
    app.use(jsonParser);
}