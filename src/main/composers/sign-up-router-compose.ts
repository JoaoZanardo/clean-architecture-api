import { MongoAddAccountRepository } from "../../infra/repositories/mongo-add-account-repository";
import { AddAcountUseCaseService, AuthUseCaseService } from "../../data/usecases";
import { Bcrypt, Jwt } from "../../infra/cryptography";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../infra/repositories";
import { SignUpRouter } from "../../presentation/routers/sign-up-router";
import env from "../config/env";
import { SignUpRouteValidationCompose } from "./sign-up-router-validation-compose";

export class SignUpRouterCompose {
    static compose() {
        const jwt = new Jwt(env.tokenScret);
        const bcrypt = new Bcrypt();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        const updateAccessTokenRepository = new MongoDBUpdateAccessTokenRepository();
        const addAccountRepository = new MongoAddAccountRepository();
        const authUseCase = new AuthUseCaseService(
            loadUserByEmailRepository,
            bcrypt,
            jwt,
            updateAccessTokenRepository
        );
        const addAccountUseCase = new AddAcountUseCaseService(
            loadUserByEmailRepository,
            addAccountRepository,
            bcrypt
        );
        const validator = SignUpRouteValidationCompose.compose();
        return new SignUpRouter(
            validator,
            addAccountUseCase,
            authUseCase
        );
    }
}