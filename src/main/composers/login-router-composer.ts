import { AuthUseCaseService } from "../../data/usecases";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../infra/repositories";
import { LoginRouter } from "../../presentation/routers/login-router";
import { Bcrypt, Jwt } from "../../infra/cryptography";
import { Validator } from "../../infra/validators";
import env from "../config/env";

export class LoginRouterCompose {
    static compose() {
        const jwt = new Jwt(env.tokenScret);
        const bcrypt = new Bcrypt();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        const updateAccessTokenRepository = new MongoDBUpdateAccessTokenRepository();
        const authUseCase = new AuthUseCaseService(
            loadUserByEmailRepository,
            bcrypt,
            jwt,
            updateAccessTokenRepository
        );
        const emailValidator = new Validator();
        return new LoginRouter(authUseCase, emailValidator);
    }
}