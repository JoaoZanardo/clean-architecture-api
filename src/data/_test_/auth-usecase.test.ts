import { AuthUseCaseService } from "../usecases/auth";
import {
    EncrypterSpy,
    LoadUserByEmailRepositorySpy,
    TokenGeneratorSpy,
    UpdateAccessTokenRepositorySpy
} from "./mocks";


const makeSut = () => {
    const mockedLoadUserByEmailRepository = new LoadUserByEmailRepositorySpy;
    const mockedEncrypter = new EncrypterSpy();
    const mockedTokenGenerator = new TokenGeneratorSpy();
    const mockedUpdateAccessTokenRepository = new UpdateAccessTokenRepositorySpy();
    return {
        mockedLoadUserByEmailRepository,
        sut: new AuthUseCaseService(mockedLoadUserByEmailRepository, mockedEncrypter, mockedTokenGenerator, mockedUpdateAccessTokenRepository),
        mockedEncrypter,
        mockedTokenGenerator,
        mockedUpdateAccessTokenRepository
    }
};

describe('Auth Usecase', () => {
    it('Should returns null if an invalid email is provided', async () => {
        const { sut, mockedLoadUserByEmailRepository } = makeSut();
        mockedLoadUserByEmailRepository.user = null;
        const accessToken = await sut.auth({ email: 'invalid@email.com', password: 'any_password' });
        expect(accessToken).toBeNull();
    });

    it('Should returns null if an invalid password is provided', async () => {
        const { sut, mockedEncrypter } = makeSut();
        mockedEncrypter.isValid = false;
        const accessToken = await sut.auth({ email: 'valid@email.com', password: 'invalid_password' });
        expect(accessToken).toBeNull();
    });

    it('Should returns an accessToken if correct credentials are provided', async () => {
        const { sut } = makeSut();
        const token = await sut.auth({ email: 'valid_email', password: 'valid_password' });
        expect(token).toEqual('valid_token');
    });

    it('Should calls LoadUserByEmailRepository with correct email', async () => {
        const { sut, mockedLoadUserByEmailRepository } = makeSut();
        const loadMethod = jest.spyOn(mockedLoadUserByEmailRepository, 'load');
        await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });
        expect(loadMethod).toHaveBeenCalledWith('any_email@mail.com')
    });

    it('Should calls Encrypter with correct values', async () => {
        const { sut, mockedEncrypter } = makeSut();
        const compareMethod = jest.spyOn(mockedEncrypter, 'compare');
        await sut.auth({ email: 'valid@email.com', password: 'any_password' });
        expect(compareMethod).toHaveBeenCalledWith('any_password', 'any_password');
    });

    it('Should calls TokenGenerator with correct userId', async () => {
        const { sut, mockedTokenGenerator } = makeSut();
        const genrateMethod = jest.spyOn(mockedTokenGenerator, 'generate');
        await sut.auth({ email: 'valid@email.com', password: 'any_password' });
        expect(genrateMethod).toHaveBeenCalledWith('any_id');
    });

    it('Should calls UpdateAccessTokenRepository with correct values', async () => {
        const { sut, mockedUpdateAccessTokenRepository } = makeSut();
        const updateMethod = jest.spyOn(mockedUpdateAccessTokenRepository, 'update');
        await sut.auth({ email: 'valid@email.com', password: 'any_password' });
        expect(updateMethod).toHaveBeenCalledWith('any_id', 'valid_token');
    });
});