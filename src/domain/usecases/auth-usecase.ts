export interface User {
    password: string
}

interface LoadUserByEmailRepository {
    load(email: string): Promise<User | null>;
}

interface Encrypter {
    compare(password: string, hashedPassword: string): Boolean;
}

export class AuthUseCase {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository,
        private encrypter: Encrypter
    ) { }

    async auth(email: string, password: string): Promise<null | string> {
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        const isValid = this.encrypter.compare(password, user.password);
        if (!isValid) return null;
        return 'VALID-ACCESS-TOKEN';
    }
}