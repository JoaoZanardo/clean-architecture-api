import {
    MissingParamError,
    InvalidParamError,
} from "../../errors";
import { throwError } from '../../../data/_test_/helper-test';
import { AddAccountUseCaseSpy } from "./mocks/mock-add-account-use-case";
import { AuthUseCaseSpy } from "./mocks/mock-auth-use-case";
import { SignUpRouter } from "../sign-up-router";
import { ValidatorSpy } from "./mocks/mock-validator";
import { HttpResponse } from "../../../presentation/protocols";

const makeSut = () => {
    const validator = new ValidatorSpy();
    const addAccountUseCase = new AddAccountUseCaseSpy();
    const authUseCase = new AuthUseCaseSpy();
    const sut = new SignUpRouter(
        validator,
        addAccountUseCase,
        authUseCase
    );
    return {
        addAccountUseCase,
        validator,
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
        const { sut, validator } = makeSut();
        validator.error = new MissingParamError('name');
        const httpRequest = {
            ...validHttpRequest,
            name: ''
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('name')));
    });

    it('Should returns 400 if no email is provided', async () => {
        const { sut, validator } = makeSut();
        validator.error = new MissingParamError('email');
        const httpRequest = {
            ...validHttpRequest,
            email: ''
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('email')));
    });

    it('Should returns 400 if an invalid email is provided', async () => {
        const { sut, validator } = makeSut();
        validator.error = new InvalidParamError('email');
        const httpRequest = {
            ...validHttpRequest,
            email: 'invalid_email'
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new InvalidParamError('email')));
    });

    it('Should returns 400 if no password is provided', async () => {
        const { sut, validator } = makeSut();
        validator.error = new MissingParamError('password');
        const httpRequest = {
            ...validHttpRequest,
            password: ''
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('password')));
    });

    it('Should returns 400 if no passwordConfirmation is provided', async () => {
        const { sut, validator } = makeSut();
        validator.error = new MissingParamError('passwordConfirmation');
        const httpRequest = {
            ...validHttpRequest,
            passwordConfirmation: ''
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError('passwordConfirmation')));
    });

    it('Should returns 400 if the passwords do not match', async () => {
        const { sut, validator } = makeSut();
        validator.error = new InvalidParamError('password')
        const httpRequest = {
            ...validHttpRequest,
            passwordConfirmation: 'different_password'
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse).toEqual(HttpResponse.badRequest(new InvalidParamError('password')));
    });

    it('Should calls Validator with correct email', async () => {
        const { sut, validator } = makeSut();
        const validateMethod = jest.spyOn(validator, 'validate');
        await sut.route(validHttpRequest);
        expect(validateMethod).toHaveBeenCalledWith(validHttpRequest.body);
    });

    it('Should returns 500 if Validator throws', async () => {
        const { sut, validator } = makeSut();
        jest.spyOn(validator, 'validate').mockImplementationOnce(throwError);
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.serverError());
    });

    it('Should returns 403 if AddAccountUseCase returns false', async () => {
        const { sut, addAccountUseCase } = makeSut();
        addAccountUseCase.isValid = false
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.forbiden());
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

    it('Should returns 500 if AddAccountUseCase throws', async () => {
        const { sut, addAccountUseCase } = makeSut();
        jest.spyOn(addAccountUseCase, 'add').mockImplementationOnce(throwError);
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.serverError());
    });

    it('Should returns 401 if AuthUseCase returns null', async () => {
        const { sut, authUseCase } = makeSut();
        authUseCase.token = null;
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.unauthorized());
    });

    it('Should returns a valid access token if AuthUseCase success', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.ok({ accessToken: 'valid_token' }));
    });

    it('Should returns 500 if AuthUseCase throws', async () => {
        const { sut, authUseCase } = makeSut();
        jest.spyOn(authUseCase, 'auth').mockImplementationOnce(throwError);
        const httpResponse = await sut.route(validHttpRequest);
        expect(httpResponse).toEqual(HttpResponse.serverError());
    });

    it('Should calls AuthUseCase with corrects values', async () => {
        const { sut, authUseCase } = makeSut();
        const authMethod = jest.spyOn(authUseCase, 'auth');
        await sut.route(validHttpRequest);
        expect(authMethod).toHaveBeenCalledWith({ email: 'valid_email', password: 'password' });
    });
});