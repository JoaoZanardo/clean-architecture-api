import { AuthUseCase, User } from "./auth-usecase";

const makeEncrypter = () => {
    class EncrypterSpy {
        public password: string = '';
        public hashedPassword: string = '';
        public isValid: boolean = true

        compare(password: string, hashedPassword: string): Boolean {
            this.password = password;
            this.hashedPassword = hashedPassword;
            return this.isValid;
        }
    }

    return new EncrypterSpy();
};

const makeLoadUserByEmailRepository = () => {
    class LoadUserByEmailRepositorySpy {
        public user: null | User = { password: 'hashed_password' };

        async load(email: string): Promise<null | User> {
            return this.user;
        }
    }

    return new LoadUserByEmailRepositorySpy();
};

const makeSut = () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
    const encrypterSpy = makeEncrypter();
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
        const { sut, encrypterSpy } = makeSut();
        encrypterSpy.isValid = false;
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