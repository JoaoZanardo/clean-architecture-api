import { AuthUseCaseService } from "../../data/usecases";
import { MongoDBLoadUserByEmailRepository } from "../../infra/repositories/mongo-load-user-by-email-repository";
import { MongoDBUpdateAccessTokenRepository } from "../../infra/repositories/mongo-update-access-token-repository";
import { LoginRouter } from "../../presentation/routers/login-router";
import { Bcrypt } from "../../infra/cryptography/bcrypt";
import { Jwt } from "../../infra/cryptography/jwt";
import { Validator } from "../../infra/validators/validator";
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