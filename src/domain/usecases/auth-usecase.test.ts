const makeSut = () => {
    interface User { }

    class LoadUserByEmailRepositorySpy {
        async load(email: string): Promise<null | User> {
            return null;
        }
    }

    class AuthUseCase {
        constructor(private loadUserByEmailRepo: LoadUserByEmailRepositorySpy) { }

        async auth(email: string, password: string): Promise<null | string> {
            const user = await this.loadUserByEmailRepo.load(email);
            if (!user) return null;
            return 'VALID-ACCESS-TOKEN';
        }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    return {
        loadUserByEmailRepositorySpy,
        sut: new AuthUseCase(loadUserByEmailRepositorySpy)
    }
};

describe('Auth Usecase', () => {
    it('Should returns null if LoadUserByEmailRepository returns null', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth('valid@email.com', 'password');
        expect(accessToken).toBeNull();
    });
});