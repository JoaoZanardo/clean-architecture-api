interface User { }

export class LoadUserByEmailRepositorySpy {
    async load(email: string): Promise<null | User> {
        return null;
    }
}

export class AuthUseCase {
    constructor(private loadUserByEmailRepo: LoadUserByEmailRepositorySpy) { }

    async auth(email: string, password: string): Promise<null | string> {
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        return 'VALID-ACCESS-TOKEN';
    }
}