import { EncrypterAdapter, TokenGeneratorAdapter } from "../../../infra/cryptography";
import { MongoDBLoadUserByEmailRepository, MongoDBUpdateAccessTokenRepository } from "../../../infra/repositories";
import { AuthUseCaseService } from "../../../data/usecases";
import { Auth } from "../../../domain/usecases";
import env from "../../config/env";

export class AuthUseCaseCompose {
    static compose(): Auth {
        const tokenGenerator = new TokenGeneratorAdapter(env.tokenScret);
        const encrypter = new EncrypterAdapter();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        const updateAccessTokenRepository = new MongoDBUpdateAccessTokenRepository();
        return new AuthUseCaseService(
            loadUserByEmailRepository,
            encrypter,
            tokenGenerator,
            updateAccessTokenRepository
        );
    }
}