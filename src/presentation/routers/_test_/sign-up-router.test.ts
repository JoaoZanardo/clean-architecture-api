import { HttpResponse } from "../../protocols";
import { MissingParamError, InvalidParamError, ForbidenError } from "../../errors";
import { EmailValidatorSpy } from "./mocks/mock-email-validator";
import { throwError } from '../../../data/_test_/helper-test';
import { AddAccountUseCaseSpy } from "./mocks/mock-add-account-use-case";

type Request = {
    body: {
        name?: string;
        email?: string;
        password?: string;
        passwordConfirmation?: string;
    }
}

class SignUpRouter {
    constructor(
        private emailValidator: EmailValidatorSpy,
        private addAccountUseCase: AddAccountUseCaseSpy
    ) { }

    async handle(request: Request): Promise<HttpResponse> {
        const { email, name, password, passwordConfirmation } = request.body
        if (!name) return HttpResponse.badRequest(new MissingParamError('name'));
        if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
        if (!this.emailValidator.isValid(email)) {
            return HttpResponse.badRequest(new InvalidParamError('email'));
        }
        if (!password) return HttpResponse.badRequest(new MissingParamError('password'));
        if (!passwordConfirmation) return HttpResponse.badRequest(new MissingParamError('passwordConfirmation'));
        if (password !== passwordConfirmation) return HttpResponse.badRequest(new InvalidParamError('password'));

        const isValid = await this.addAccountUseCase.add({ name, email, password });
        if (!isValid) return HttpResponse.forbiden();

        return HttpResponse.ok({});
    }
}

const makeSut = () => {
    const emailValidator = new EmailValidatorSpy();
    const addAccountUseCase = new AddAccountUseCaseSpy();
    const sut = new SignUpRouter(emailValidator, addAccountUseCase);
    return {
        addAccountUseCase,
        emailValidator,
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
        const response = await sut.handle(httpRequest);
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
        const response = await sut.handle(httpRequest);
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
        const response = await sut.handle(httpRequest);
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
        const response = await sut.handle(httpRequest);
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
        const response = await sut.handle(httpRequest);
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
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toEqual(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('password'));
    });

    it('Should calls EmailValidator with correct email', async () => {
        const { sut, emailValidator } = makeSut();
        const isValidMethod = jest.spyOn(emailValidator, 'isValid');
        await sut.handle(validHttpRequest);
        expect(isValidMethod).toHaveBeenCalledWith('valid_email');
    });

    it('Should throws if EmailValidator throws', async () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(throwError);
        const promise = sut.handle(validHttpRequest);
        await expect(promise).rejects.toThrow();
    });

    it('Should returns 403 if AddAccountUseCase returns false', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(validHttpRequest);
        expect(httpResponse.statusCode).toEqual(403);
        expect(httpResponse.body).toEqual(new ForbidenError());
    });

    it('Should calls AddAccountUseCase with correct values', async () => {
        const { sut, addAccountUseCase } = makeSut();
        const addMethod = jest.spyOn(addAccountUseCase, 'add');
        await sut.handle(validHttpRequest);
        expect(addMethod).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'valid_email',
            password: 'password'
        });
    });

    it('Should throws if AddAccountUseCase throws', async () => {
        const { sut, addAccountUseCase } = makeSut();
        jest.spyOn(addAccountUseCase, 'add').mockImplementationOnce(throwError);
        const promise = sut.handle(validHttpRequest);
        await expect(promise).rejects.toThrow();
    });
});