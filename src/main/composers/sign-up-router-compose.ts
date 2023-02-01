import { MongoAddAccountRepository } from "../../infra/repositories";
import { AddAcountUseCaseService, AuthUseCaseService } from "../../data/usecases";
import { EncrypterAdapter, TokenGeneratorAdapter } from "../../infra/cryptography";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../infra/repositories";
import { SignUpRouter } from "../../presentation/routers/";
import env from "../config/env";
import { SignUpRouteValidationCompose } from "./sign-up-router-validation-compose";

export class SignUpRouterCompose {
    static compose() {
        const tokenGenerator = new TokenGeneratorAdapter(env.tokenScret);
        const encrypter = new EncrypterAdapter();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        const updateAccessTokenRepository = new MongoDBUpdateAccessTokenRepository();
        const addAccountRepository = new MongoAddAccountRepository();
        const authUseCase = new AuthUseCaseService(
            loadUserByEmailRepository,
            encrypter,
            tokenGenerator,
            updateAccessTokenRepository
        );
        const addAccountUseCase = new AddAcountUseCaseService(
            loadUserByEmailRepository,
            addAccountRepository,
            encrypter
        );
        const validator = SignUpRouteValidationCompose.compose();
        return new SignUpRouter(
            validator,
            addAccountUseCase,
            authUseCase
        );
    }
}