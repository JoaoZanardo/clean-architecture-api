import { Router } from "express";
import { ExpressRouterAdapter } from "../adapters/express-router-adapter";
import { loginRouter } from "../composers/login-router-composer";

export const loginRoutes = (router: Router) => {
    router.post('/login', ExpressRouterAdapter.adapt(loginRouter));
};