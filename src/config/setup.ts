import { Application } from "express";

export const setupApp = (app: Application): void => {
    app.disable('x-powered-by');
}