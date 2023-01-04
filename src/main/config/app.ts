import Express from "express";
import { setupRoutes } from "./routes";
import { setupApp } from "./setup";
const app = Express();

setupApp(app);
setupRoutes(app);

export default app;