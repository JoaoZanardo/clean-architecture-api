import {
    MissingParamError,
    InvalidParamError,
    ForbidenError,
    UnauthorizedError
} from "../../errors";
import { EmailValidatorSpy } from "./mocks/mock-email-validator";
import { throwError } from '../../../data/_test_/helper-test';
import { AddAccountUseCaseSpy } from "./mocks/mock-add-account-use-case";
import { AuthUseCaseSpy } from "./mocks/mock-auth-use-case";
import { SignUpRouter } from "../sign-up-router";

const makeSut = () => {
    const emailValidator = new EmailValidatorSpy();
    const addAccountUseCase = new AddAccountUseCaseSpy();
    const authUseCase = new AuthUseCaseSpy();
    const sut = new SignUpRouter(
        emailValidator,
        addAccountUseCase,
        authUseCase
    );
    return {
        addAccountUseCase,
        emailValidator,
        authUseCase,
        sut
    }
}

describe('SignUp Router', () => {
    const validHttpRequest = {
        body: {
            name: 'any_name',
            email: 'valid_email',
            password: 'password',
            passwordConfirmation: 'password'
        }
    }

    it('Should returns 400 if no name is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'valid_email'
            }
        }
        const response = await sut.route(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('Should returns 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name'
            }
        }
        const response = await sut.route(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('Should returns 400 if an invalid email is provided', async () => {
        const { sut, emailValidator } = makeSut();
        emailValidator.isEmailValid = false;
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email'
            }
        }
        const response = await sut.route(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });

    it('Should returns 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'valid_email'
            }
        }
        const response = await sut.route(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('Should returns 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'valid_email',
                password: 'any_password'
            }
        }
        const response = await sut.route(httpRequest);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new MissingParamError('passwordConfirmation'));
    });

    it('Should returns 400 if the passwords do not match', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'valid_email',
                password: 'any_password',
                passwordConfirmation: 'passwordConfirmation'
            }
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toEqual(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('password'));
    });

    it('Should calls EmailValidator with correct email', async () => {
        const { sut, emailValidator } = makeSut();
        const isValidMethod = jest.spyOn(emailValidator, 'isValid');
        await sut.route(validHttpRequest);
        expect(isValidMethod).toHaveBeenCalledWith('valid_email');
    });

    it('Should throws if EmailValidator throws', async () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(throwError);
        const promise = sut.route(validHttpRequest);
        await expect(promise).rejects.toThrow();
    });

    it('Should returns 403 if AddAccountUseCase returns false', async () => {
        const { sut, addAccountUseCase } = makeSut();
        addAccountUseCase.isValid = false
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse.statusCode).toEqual(403);
        expect(httpResponse.body).toEqual(new ForbidenError());
    });

    it('Should calls AddAccountUseCase with correct values', async () => {
        const { sut, addAccountUseCase } = makeSut();
        const addMethod = jest.spyOn(addAccountUseCase, 'add');
        await sut.route(validHttpRequest);
        expect(addMethod).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'valid_email',
            password: 'password'
        });
    });

    it('Should throws if AddAccountUseCase throws', async () => {
        const { sut, addAccountUseCase } = makeSut();
        jest.spyOn(addAccountUseCase, 'add').mockImplementationOnce(throwError);
        const promise = sut.route(validHttpRequest);
        await expect(promise).rejects.toThrow();
    });

    it('Should returns 401 if AuthUseCase returns null', async () => {
        const { sut, authUseCase } = makeSut();
        authUseCase.token = null;
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse.statusCode).toEqual(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    it('Should returns a valid access token if AuthUseCase success', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse.statusCode).toEqual(200);
        expect(httpResponse.body).toEqual({ accessToken: 'valid_token' });
    });

    it('Should throws if AuthUseCase throws', async () => {
        const { sut, authUseCase } = makeSut();
        jest.spyOn(authUseCase, 'auth').mockImplementationOnce(throwError);
        const promise = sut.route(validHttpRequest);
        await expect(promise).rejects.toThrow();
    });

    it('Should calls AuthUseCase with corrects values', async () => {
        const { sut, authUseCase } = makeSut();
        const authMethod = jest.spyOn(authUseCase, 'auth');
        await sut.route(validHttpRequest);
        expect(authMethod).toHaveBeenCalledWith({ email: 'valid_email', password: 'password' });
    });
});