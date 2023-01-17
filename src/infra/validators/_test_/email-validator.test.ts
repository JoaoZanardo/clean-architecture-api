import { Validator } from '../';
import validator from 'validator';

interface MockedValidator {
    email: string;
    isEmailValid: boolean;
}

jest.mock('validator', () => ({
    email: '',
    isEmailValid: true,

    isEmail(email: string): boolean {
        this.email = email;
        return this.isEmailValid
    },
}));

const makeSut = () => {
    return {
        sut: new Validator(),
        mockedValidator: validator as unknown as jest.Mocked<MockedValidator>
    }
};

describe('Email Validator', () => {
    it('Should returns true if validator returns true', () => {
        const { sut } = makeSut();
        const isEmailValid = sut.isValid('valid_email');
        expect(isEmailValid).toBeTruthy();
    });

    it('Should returns false if validator returns false', () => {
        const { sut, mockedValidator } = makeSut();
        mockedValidator.isEmailValid = false;
        const isEmailValid = sut.isValid('invalid_email');
        expect(isEmailValid).toBeFalsy();
    });

    it('Should call validator with correct value', () => {
        const { sut, mockedValidator } = makeSut();
        sut.isValid('valid_email');
        expect(mockedValidator.email).toEqual('valid_email');
    });
});