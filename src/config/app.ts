import Express from "express";
import { setupApp } from "./setup";
const app = Express();

setupApp(app);

export default app;