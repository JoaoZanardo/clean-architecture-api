import { MongoAddAccountRepository } from "../../infra/repositories/mongo-add-account-repository";
import { AddAcountUseCaseService, AuthUseCaseService } from "../../data/usecases";
import { Bcrypt, Jwt } from "../../infra/cryptography";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../infra/repositories";
import { Validator } from "../../infra/validators";
import { SignUpRouter } from "../../presentation/routers/sign-up-router";
import env from "../config/env";

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
        const emailValidator = new Validator();
        const addAccountUseCase = new AddAcountUseCaseService(
            loadUserByEmailRepository,
            addAccountRepository,
            bcrypt
        )
        return new SignUpRouter(
            emailValidator,
            addAccountUseCase,
            authUseCase
        );
    }
}