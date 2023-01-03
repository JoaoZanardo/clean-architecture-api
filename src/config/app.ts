import Express from "express";
import { setupApp } from "./setup";
const app = Express();

setupApp(app);

app.use((req, res, next) => {
    res.set('access-control-allow-origin', '*');
    res.set('access-control-allow-methods', '*');
    res.set('access-control-allow-headers', '*');
    next();
});

export default app;