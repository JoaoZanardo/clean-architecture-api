import { throwError } from "../../../data/_test_/helper-test";
import {
    MissingParamError,
    InvalidParamError,
} from "../../errors";
import { LoginRouter } from "../";
import { AuthUseCaseSpy } from "./mocks/mock-auth-use-case";
import { ValidatorSpy } from "./mocks/mock-validator";
import { HttpResponse } from "../../../presentation/protocols";

const makeSut = () => {
    const authUseCaseSpy = new AuthUseCaseSpy();
    const validatorSpy = new ValidatorSpy();
    const sut = new LoginRouter(authUseCaseSpy, validatorSpy);
    return {
        sut,
        authUseCaseSpy,
        validatorSpy,
    }
};

describe('Login Router', () => {
    const validHttpRequest = {
        body: {
            email: 'valid@email.com',
            password: 'valid_password'
        }
    }

    it('Should return 400 if no email is provided', async () => {
        const { sut, validatorSpy } = makeSut();
        validatorSpy.error = new MissingParamError('email');
        const httpRequest = {
            body: {
                email: '',
                password: 'any_password'
            }
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('email')));
    });

    it('Should return 400 if an invalid email is provided', async () => {
        const { sut, validatorSpy } = makeSut();
        validatorSpy.error = new InvalidParamError('email');
        const httpRequest = {
            body: {
                email: 'invalid@email.com',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new InvalidParamError('email')));
    });

    it('Should return 400 if no password is provided', async () => {
        const { sut, validatorSpy } = makeSut();
        validatorSpy.error = new MissingParamError('password');
        const httpRequest = {
            body: {
                email: 'any@email.com',
                password: ''
            }
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('password')));
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
        expect(httpResponse).toEqual(HttpResponse.unauthorized());
    });

    it('Should return 200 when valid credentials are provided', async () => {
        const { sut, } = makeSut();
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.ok(httpResponse.body));
    });

    it('Should return 500 if AuthUseCase throws', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        jest.spyOn(authUseCaseSpy, 'auth').mockImplementationOnce(throwError);
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.serverError());
    });

    it('Should return 500 if Validator throws', async () => {
        const { sut, validatorSpy } = makeSut();
        jest.spyOn(validatorSpy, 'validate').mockImplementationOnce(throwError);
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.serverError());
    });

    it('Should calls EmailValidator with correct email', async () => {
        const { sut, validatorSpy } = makeSut();
        const validateMethod = jest.spyOn(validatorSpy, 'validate');
        await sut.route(validHttpRequest);
        expect(validateMethod).toHaveBeenCalledWith(validHttpRequest.body);
    });

    it('Should calls AuthUseCase with correct values', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const authMethod = jest.spyOn(authUseCaseSpy, 'auth');
        await sut.route(validHttpRequest);
        expect(authMethod).toHaveBeenCalledWith({ email: 'valid@email.com', password: 'valid_password' });
    });
});