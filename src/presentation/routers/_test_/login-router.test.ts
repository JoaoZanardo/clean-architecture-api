import { throwError } from "../../../data/_test_/helper-test";
import {
    UnauthorizedError,
    ServerError,
    MissingParamError,
    InvalidParamError,
} from "../../errors";
import { LoginRouter } from "../login-router";
import { AuthUseCaseSpy } from "./mocks/mock-auth-use-case";
import { EmailValidatorSpy } from "./mocks/mock-email-validator";

const makeSut = () => {
    const authUseCaseSpy = new AuthUseCaseSpy();
    const emailValidatorSpy = new EmailValidatorSpy();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy,
    }
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
        const { sut, emailValidatorSpy } = makeSut();
        emailValidatorSpy.isEmailValid = false;
        const htppRequest = {
            body: {
                email: 'invalid@email.com',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const htppRequest = {
            body: {
                email: 'any@email.com'
            }
        };
        const htppResponse = await sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 401 when invalid credentials are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.token = null;
        const htppRequest = {
            body: {
                email: 'invalid@email.com',
                password: 'invalid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    it('Should return 200 when valid credentials are provided', async () => {
        const { sut, } = makeSut();
        const htppRequest = {
            body: {
                email: 'valid@email.com',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    it('Should return 500 if AuthUseCase throws', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        jest.spyOn(authUseCaseSpy, 'auth').mockImplementationOnce(throwError);
        const htppRequest = {
            body: {
                email: 'valid@email.com',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    it('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorSpy } = makeSut();
        jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError);
        const htppRequest = {
            body: {
                email: 'valid@email.com',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    it('Should calls EmailValidator with correct email', async () => {
        const { sut, emailValidatorSpy } = makeSut();
        const htppRequest = {
            body: {
                email: 'valid@email.com',
                password: 'valid_password'
            }
        };
        const email = jest.spyOn(emailValidatorSpy, 'isValid');
        await sut.route(htppRequest);
        expect(email).toHaveBeenCalledWith('valid@email.com');
    });

    it('Should calls AuthUseCase with correct values', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const htppRequest = {
            body: {
                email: 'valid@email.com',
                password: 'valid_password'
            }
        };
        const values = jest.spyOn(authUseCaseSpy, 'auth');
        await sut.route(htppRequest);
        expect(values).toHaveBeenCalledWith('valid@email.com', 'valid_password');
    });
});