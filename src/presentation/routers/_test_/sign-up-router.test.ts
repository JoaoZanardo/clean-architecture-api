import { HttpResponse } from "../../protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { EmailValidatorSpy } from "./mocks/mock-email-validator";

type Request = {
    body: {
        name?: string;
        email?: string;
        password?: string;
        passwordConfirmation?: string;
    }
}

class SignUpRouter {
    constructor(private emailValidator: EmailValidatorSpy) { }

    async handle(request: Request): Promise<HttpResponse> {
        const { email, name, password, passwordConfirmation } = request.body
        if (!name) return HttpResponse.badRequest(new MissingParamError('name'));
        if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
        if (!this.emailValidator.isValid(email)) {
            return HttpResponse.badRequest(new InvalidParamError('email'));
        }
        if (!password) return HttpResponse.badRequest(new MissingParamError('password'));
        if (!passwordConfirmation) return HttpResponse.badRequest(new MissingParamError('passwordConfirmation'));
        return HttpResponse.ok({});
    }
}

const makeSut = () => {
    const emailValidator = new EmailValidatorSpy();
    const sut = new SignUpRouter(emailValidator);
    return {
        emailValidator,
        sut
    }
}

describe('SignUp Router', () => {
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
});