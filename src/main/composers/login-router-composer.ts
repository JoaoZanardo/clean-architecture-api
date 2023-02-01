import { AuthUseCaseService } from "../../data/usecases";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../infra/repositories";
import { LoginRouter } from "../../presentation/routers";
import { EncrypterAdapter, TokenGeneratorAdapter } from "../../infra/cryptography";
import env from "../config/env";
import { LoginRouterValidationCompose } from "./login-router-validation-composer";

export class LoginRouterCompose {
    static compose() {
        const tokenGenerator = new TokenGeneratorAdapter(env.tokenScret);
        const encrypter = new EncrypterAdapter();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        const updateAccessTokenRepository = new MongoDBUpdateAccessTokenRepository();
        const authUseCase = new AuthUseCaseService(
            loadUserByEmailRepository,
            encrypter,
            tokenGenerator,
            updateAccessTokenRepository
        );
        const validation = LoginRouterValidationCompose.compose()
        return new LoginRouter(authUseCase, validation);
    }
}