import { AuthUseCase } from "../../domain/usecases/auth-usecase";
import { DbLoadUserByEmailRepository } from "../../infra/repositories/load-user-by-email-repository";
import { DbUpdateAccessTokenRepository } from "../../infra/repositories/update-access-token-repository";
import { LoginRouter } from "../../presentation/routers/login-router";
import { Bcrypt } from "../../utils/bcrypt";
import { Jwt } from "../../utils/jwt";
import { Validator } from "../../utils/validator";
import env from "../config/env";

export class LoginRouterCompose {
    static compose() {
        const jwt = new Jwt(env.tokenScret);
        const bcrypt = new Bcrypt();
        const loadUserByEmailRepository = new DbLoadUserByEmailRepository();
        const updateAccessTokenRepository = new DbUpdateAccessTokenRepository();
        const authUseCase = new AuthUseCase(
            loadUserByEmailRepository,
            bcrypt,
            jwt,
            updateAccessTokenRepository
        );
        const emailValidator = new Validator();
        return new LoginRouter(authUseCase, emailValidator);
    }
}