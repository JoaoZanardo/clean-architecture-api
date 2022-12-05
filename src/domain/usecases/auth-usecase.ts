export interface User {
    id: string
    password: string
}

interface LoadUserByEmailRepository {
    load(email: string): Promise<User | null>;
}

interface Encrypter {
    compare(password: string, hashedPassword: string): Boolean;
}

interface TokenGenerator {
    generate(userId: string): Promise<string | null>;
}

export class AuthUseCase {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository,
        private encrypter: Encrypter,
        private tokenGenerator: TokenGenerator
    ) { }

    async auth(email: string, password: string): Promise<null | string> {
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        const isValid = this.encrypter.compare(password, user.password);
        if (!isValid) return null;
        return await this.tokenGenerator.generate(user.id);
    }
}