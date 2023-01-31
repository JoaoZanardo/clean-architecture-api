import { Encrypter, TokenGenerator } from "../protocols/cryptography";
import { LoadUserByEmailRepository, UpdateAccessTokenRepository } from "../protocols/db";
import { Auth } from "../../domain/usecases";

export class AuthUseCaseService implements Auth {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository,
        private encrypter: Encrypter,
        private tokenGenerator: TokenGenerator,
        private updateAccessTokenRepo: UpdateAccessTokenRepository
    ) { }

    async auth(params: Auth.Params): Promise<Auth.Result> {
        const { email, password } = params;
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        const isValid = await this.encrypter.compare(password, user.password);
        if (!isValid) return null;
        const accessToken = this.tokenGenerator.generate(user.id);
        await this.updateAccessTokenRepo.update(user.id, accessToken);
        return accessToken;
    }
}