import { MongoDBLoadUserByEmailRepository } from "../../infra/repositories/mongo-load-user-by-email-repository";
import { MongoDBUpdateAccessTokenRepository } from "../../infra/repositories/mongo-update-access-token-repository";
import { Bcrypt } from "../../utils/bcrypt";
import { Jwt } from "../../utils/jwt";
import { AuthUseCase } from "./auth-usecase";

jest.mock("../../infra/repositories/mongo-load-user-by-email-repository");
jest.mock("../../infra/repositories/mongo-update-access-token-repository");
jest.mock("../../utils/bcrypt");
jest.mock("../../utils/jwt");

const makeMockedEncrypter = () => {
    return new Bcrypt() as jest.Mocked<Bcrypt>;
};

const makeMockedLoadUserByEmailRepository = () => {
    return new MongoDBLoadUserByEmailRepository() as jest.Mocked<MongoDBLoadUserByEmailRepository>;
};

const makeMockedTokengenerator = () => {
    return new Jwt('secret') as jest.Mocked<Jwt>;
};

const makeMockedUpdateAccessTokenRepository = () => {
    return new MongoDBUpdateAccessTokenRepository() as jest.Mocked<MongoDBUpdateAccessTokenRepository>;
};

const makeSut = () => {
    const mockedLoadUserByEmailRepository = makeMockedLoadUserByEmailRepository();
    const mockedEncrypter = makeMockedEncrypter();
    const mockedTokenGenerator = makeMockedTokengenerator();
    const mockedUpdateAccessTokenRepository = makeMockedUpdateAccessTokenRepository();
    return {
        mockedLoadUserByEmailRepository,
        sut: new AuthUseCase(mockedLoadUserByEmailRepository, mockedEncrypter, mockedTokenGenerator, mockedUpdateAccessTokenRepository),
        mockedEncrypter,
        mockedTokenGenerator,
        mockedUpdateAccessTokenRepository
    }
};

describe('Auth Usecase', () => {
    it('Should returns null if an invalid email is provided', async () => {
        const { sut, mockedLoadUserByEmailRepository } = makeSut();
        mockedLoadUserByEmailRepository.load.mockResolvedValueOnce(null);
        const accessToken = await sut.auth('invalid@email.com', 'any_password');
        expect(accessToken).toBeNull();
    });

    it('Should returns null if an invalid password is provided', async () => {
        const { sut, mockedEncrypter } = makeSut();
        mockedEncrypter.compare.mockResolvedValueOnce(false);
        const accessToken = await sut.auth('valid@email.com', 'invalid_password');
        expect(accessToken).toBeNull();
    });

    it('Should returns an accessToken if correct credentials are provided', async () => {
        const {
            sut,
            mockedTokenGenerator,
            mockedLoadUserByEmailRepository,
            mockedEncrypter,
            mockedUpdateAccessTokenRepository
        } = makeSut();
        mockedLoadUserByEmailRepository.load.mockResolvedValueOnce({ id: 'any_id', password: 'any_password' });
        mockedEncrypter.compare.mockResolvedValueOnce(true);
        mockedTokenGenerator.generate.mockReturnValueOnce('valid_token');
        mockedUpdateAccessTokenRepository.update.mockResolvedValueOnce();
        const accessToken = await sut.auth('valid@email.com', 'any_password');
        expect(accessToken).toBeTruthy();
        expect(accessToken).toEqual('valid_token');
    });

    // it('Should calls LoadUserByEmailRepository with correct email', async () => {
    //     const { sut, mockedLoadUserByEmailRepository } = makeSut();
    //     await sut.auth('any@email.com', 'any_password');
    //     expect(mockedLoadUserByEmailRepository).toEqual('any@email.com');
    // });

    // it('Should calls Encrypter with correct values', async () => {
    //     const { sut, mockedEncrypter, mockedLoadUserByEmailRepository } = makeSut();
    //     await sut.auth('valid@email.com', 'any_password');
    //     expect(mockedEncrypter).toEqual('any_password');
    //     expect(mockedEncrypter).toEqual(mockedLoadUserByEmailRepository);
    // });

    // it('Should calls TokenGenerator with correct userId', async () => {
    //     const { sut, mockedTokenGenerator, mockedLoadUserByEmailRepository } = makeSut();
    //     await sut.auth('valid@email.com', 'any_password');
    //     expect(mockedTokenGenerator.userId).toEqual(mockedLoadUserByEmailRepository.user?.id);
    // });

    // it('Should calls UpdateAccessTokenRepository with correct values', async () => {
    //     const { sut, mockedUpdateAccessTokenRepository, mockedLoadUserByEmailRepository } = makeSut();
    //     const accessToken = await sut.auth('valid@email.com', 'any_password');
    //     expect(mockedUpdateAccessTokenRepository.userId).toEqual(mockedLoadUserByEmailRepository.user?.id);
    //     expect(mockedUpdateAccessTokenRepository.accessToken).toEqual(accessToken);
    // });
});