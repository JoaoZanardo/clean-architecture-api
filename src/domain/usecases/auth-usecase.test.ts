import { AuthUseCase, User } from "./auth-usecase";

const makeSut = () => {
    class EncrypterSpy {
        public password: string = '';
        public hashedPassword: string = '';

        compare(password: string, hashedPassword: string): Boolean {
            this.password = password;
            this.hashedPassword = hashedPassword;
            return false;
        }
    }

    class LoadUserByEmailRepositorySpy {
        public user: null | User = { password: 'hashed_password' };

        async load(email: string): Promise<null | User> {
            return this.user;
        }
    }

    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    const encrypterSpy = new EncrypterSpy();
    return {
        loadUserByEmailRepositorySpy,
        sut: new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy),
        encrypterSpy
    }
};

describe('Auth Usecase', () => {
    it('Should returns null if an invalid email is provided', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        loadUserByEmailRepositorySpy.user = null;
        const accessToken = await sut.auth('invalid@email.com', 'any_password');
        expect(accessToken).toBeNull();
    });

    it('Should returns null if an invalid password is provided', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth('valid@email.com', 'invalid_password');
        expect(accessToken).toBeNull();
    });

    it('Should calls Encrypter with correct values', async () => {
        const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut();
        await sut.auth('valid@email.com', 'any_password');
        expect(encrypterSpy.password).toEqual('any_password');
        expect(encrypterSpy.hashedPassword).toEqual(loadUserByEmailRepositorySpy.user?.password);
    });
});