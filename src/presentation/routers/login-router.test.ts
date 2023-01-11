import {
    UnauthorizedError,
    ServerError,
    MissingParamError,
    InvalidParamError,
} from "../errors";
import { LoginRouter } from "./login-router";
import { AuthUseCase } from '../../domain/usecases/auth-usecase';
import { Bcrypt } from "../../utils/bcrypt";
import { Jwt } from "../../utils/jwt";
import { MongoDBUpdateAccessTokenRepository } from "../../infra/repositories/mongo-update-access-token-repository";
import { MongoDBLoadUserByEmailRepository } from "../../infra/repositories/mongo-load-user-by-email-repository";
import { Validator } from "../../utils/validator";

jest.mock('../../domain/usecases/auth-usecase');
jest.mock('../../utils/validator');

const makeSut = () => {
    const mockedAuthUseCase = makeMockedAuthUseCase();
    const mockedEmailValidator = makeMockedEmailValidator();
    const sut = new LoginRouter(mockedAuthUseCase, mockedEmailValidator);
    return {
        sut,
        mockedAuthUseCase,
        mockedEmailValidator,
    }
};

const makeMockedAuthUseCase = () => {
    return new AuthUseCase(
        new MongoDBLoadUserByEmailRepository(),
        new Bcrypt(), new Jwt('secret'),
        new MongoDBUpdateAccessTokenRepository()
    ) as jest.Mocked<AuthUseCase>;
}

const makeMockedEmailValidator = () => {
    return new Validator() as jest.Mocked<Validator>;
};

describe('Login Router', () => {
    it('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const htppRequest = {
            body: {
                password: 'any_password'
            }
        };
        const htppResponse = await sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if an invalid email is provided', async () => {
        const { sut, mockedEmailValidator } = makeSut();
        mockedEmailValidator.isValid.mockReturnValueOnce(false)

        const htppRequest = {
            body: {
                email: 'invalid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('Should return 400 if no password is provided', async () => {
        const { sut, mockedEmailValidator } = makeSut();
        mockedEmailValidator.isValid.mockReturnValueOnce(true);
        const htppRequest = {
            body: {
                email: 'any_email'
            }
        };
        const htppResponse = await sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 401 when invalid credentials are provided', async () => {
        const { sut, mockedAuthUseCase, mockedEmailValidator } = makeSut();
        mockedAuthUseCase.auth.mockResolvedValueOnce(null);
        mockedEmailValidator.isValid.mockReturnValueOnce(true);
        const htppRequest = {
            body: {
                email: 'invalid_email',
                password: 'invalid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    it('Should return 200 when valid credentials are provided', async () => {
        const { sut, mockedAuthUseCase, mockedEmailValidator } = makeSut();
        mockedAuthUseCase.auth.mockResolvedValueOnce('valid_token');
        mockedEmailValidator.isValid.mockReturnValueOnce(true);
        const htppRequest = {
            body: {
                email: 'valid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    it('Should return 500 if AuthUseCase throws', async () => {
        const { sut, mockedAuthUseCase, mockedEmailValidator } = makeSut();
        mockedAuthUseCase.auth.mockRejectedValueOnce(null);
        mockedEmailValidator.isValid.mockReturnValueOnce(true);
        const htppRequest = {
            body: {
                email: 'valid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    // it('Should return 500 if EmailValidator throws', async () => {
    //     const { mockedAuthUseCase, mockedEmailValidator } = makeSut();
    //     mockedAuthUseCase.auth.mockResolvedValueOnce('valid_token');
    //     mockedEmailValidator.isValid.mockReturnValueOnce(true);
    //     const sut = new LoginRouter(mockedAuthUseCase, mockedEmailValidator);
    //     const htppRequest = {
    //         body: {
    //             email: 'valid_email',
    //             password: 'valid_password'
    //         }
    //     };
    //     const httpResponse = await sut.route(htppRequest);
    //     expect(httpResponse.statusCode).toBe(500);
    //     expect(httpResponse.body).toEqual(new ServerError());
    // });
});