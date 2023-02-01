import { AuthUseCaseService } from "../../data/usecases";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../infra/repositories";
import { LoginRouter } from "../../presentation/routers";
import { Bcrypt, Jwt } from "../../infra/cryptography";
import env from "../config/env";
import { LoginRouterValidationCompose } from "./login-router-validation-composer";

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
        const validation = LoginRouterValidationCompose.compose()
        return new LoginRouter(authUseCase, validation);
    }
}