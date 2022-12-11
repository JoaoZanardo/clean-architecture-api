import { TokenGenerator } from "../../interfaces/token-generator";
import { Encrypter } from "../../interfaces/encrypter";

export interface User {
    id: string
    password: string
}

interface LoadUserByEmailRepository {
    load(email: string): Promise<User | null>;
}

interface UpdateAccessTokenRepository {
    update(userId: string, accessToken: string | null): Promise<void>;
}

export class AuthUseCase {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository,
        private encrypter: Encrypter,
        private tokenGenerator: TokenGenerator,
        private updateAccessTokenRepo: UpdateAccessTokenRepository
    ) { }

    async auth(email: string, password: string): Promise<null | string> {
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        const isValid = await this.encrypter.compare(password, user.password);
        if (!isValid) return null;
        const accessToken = await this.tokenGenerator.generate(user.id);
        await this.updateAccessTokenRepo.update(user.id, accessToken);
        return accessToken;
    }
}