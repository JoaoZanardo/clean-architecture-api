import { Encrypter, TokenGenerator } from "../protocols/cryptography";
import { LoadUserByEmailRepository, UpdateAccessTokenRepository } from "../protocols/db";
import { User } from "../../interfaces/user";
import { AuthUseCase } from "../../domain/usecases";

export class AuthUseCaseService implements AuthUseCase {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository<User>,
        private encrypter: Encrypter,
        private tokenGenerator: TokenGenerator,
        private updateAccessTokenRepo: UpdateAccessTokenRepository
    ) { }

    async auth(email: string, password: string): Promise<null | string> {
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        const isValid = await this.encrypter.compare(password, user.password);
        if (!isValid) return null;
        const accessToken = this.tokenGenerator.generate(user.id);
        await this.updateAccessTokenRepo.update(user.id, accessToken);
        return accessToken;
    }
}