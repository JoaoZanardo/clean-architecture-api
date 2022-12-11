import { AuthUseCase, User } from "./auth-usecase";

const makeEncrypter = () => {
    class EncrypterSpy {
        public password: string | null = null;
        public hashedPassword: string | null = null;
        public isValid: boolean = true

        async compare(password: string, hashedPassword: string): Promise<Boolean> {
            this.password = password;
            this.hashedPassword = hashedPassword;
            return this.isValid;
        }
    }

    return new EncrypterSpy();
};

const makeLoadUserByEmailRepository = () => {
    class LoadUserByEmailRepositorySpy {
        public user: null | User = {
            id: 'any_id',
            password: 'hashed_password'
        };
        public email: string | null = null;

        async load(email: string): Promise<null | User> {
            this.email = email;
            return this.user;
        }
    }

    return new LoadUserByEmailRepositorySpy();
};

const makeTokengenerator = () => {
    class TokenGeneratorSpy {
        public userId: string | null = null;
        public accessToken: string | null = 'VALID-ACCESS-TOKEN'

        async generate(userId: string): Promise<string | null> {
            this.userId = userId;
            return this.accessToken;
        }
    }

    return new TokenGeneratorSpy();
};

const makeUpdateAccessTokenRepository = () => {
    class UpdateAccessTokenRepositorySpy {
        public userId: string | null = null;
        public accessToken: string | null = null;

        async update(userId: string, accessToken: string | null): Promise<void> {
            this.userId = userId;
            this.accessToken = accessToken;
        }
    }

    return new UpdateAccessTokenRepositorySpy();
};

const makeSut = () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
    const encrypterSpy = makeEncrypter();
    const tokenGeneratorSpy = makeTokengenerator();
    const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();
    return {
        loadUserByEmailRepositorySpy,
        sut: new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy),
        encrypterSpy,
        tokenGeneratorSpy,
        updateAccessTokenRepositorySpy
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

    it('Should returns an accessToken if correct credentials are provided', async () => {
        const { sut, tokenGeneratorSpy } = makeSut();
        const accessToken = await sut.auth('valid@email.com', 'any_password');
        expect(accessToken).toEqual(tokenGeneratorSpy.accessToken);
        expect(accessToken).toBeTruthy();
    });

    it('Should calls LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        await sut.auth('any@email.com', 'any_password');
        expect(loadUserByEmailRepositorySpy.email).toEqual('any@email.com');
    });

    it('Should calls Encrypter with correct values', async () => {
        const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut();
        await sut.auth('valid@email.com', 'any_password');
        expect(encrypterSpy.password).toEqual('any_password');
        expect(encrypterSpy.hashedPassword).toEqual(loadUserByEmailRepositorySpy.user?.password);
    });

    it('Should calls TokenGenerator with correct userId', async () => {
        const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut();
        await sut.auth('valid@email.com', 'any_password');
        expect(tokenGeneratorSpy.userId).toEqual(loadUserByEmailRepositorySpy.user?.id);
    });

    it('Should calls UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositorySpy, loadUserByEmailRepositorySpy } = makeSut();
        const accessToken = await sut.auth('valid@email.com', 'any_password');
        expect(updateAccessTokenRepositorySpy.userId).toEqual(loadUserByEmailRepositorySpy.user?.id);
        expect(updateAccessTokenRepositorySpy.accessToken).toEqual(accessToken);
    });
});