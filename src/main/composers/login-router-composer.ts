import { AuthUseCase } from "../../domain/usecases/auth-usecase";
import { MongoLoadUserByEmailRepository } from "../../infra/repositories/mongo-load-user-by-email-repository";
import { MongoDBUpdateAccessTokenRepository } from "../../infra/repositories/mongo-update-access-token-repository";
import { LoginRouter } from "../../presentation/routers/login-router";
import { Bcrypt } from "../../utils/bcrypt";
import { Jwt } from "../../utils/jwt";
import { Validator } from "../../utils/validator";
import env from "../config/env";

export class LoginRouterCompose {
    static compose() {
        const jwt = new Jwt(env.tokenScret);
        const bcrypt = new Bcrypt();
        const loadUserByEmailRepository = new MongoLoadUserByEmailRepository();
        const updateAccessTokenRepository = new MongoDBUpdateAccessTokenRepository();
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