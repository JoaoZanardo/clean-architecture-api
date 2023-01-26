import { Router } from "express";
import { ExpressRouterAdapter } from "../adapters/express-router-adapter";
import { LoginRouterCompose } from "../composers/login-router-composer";
import { SignUpRouterCompose } from "../composers/sign-up-router-compose";

export const loginRoutes = (router: Router) => {
    router.post('/signup', ExpressRouterAdapter.adapt(SignUpRouterCompose.compose()));
    router.post('/login', ExpressRouterAdapter.adapt(LoginRouterCompose.compose()));
};