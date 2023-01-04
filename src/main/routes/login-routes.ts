import { Router } from "express";
import { loginRouter } from "../composers/login-router-composer";


export const loginRoutera = (router: Router) => {

    router.post('/login');
};