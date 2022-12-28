import { Validator } from './validator';

jest.mock('./validator');

const makeSut = () => {
    return new Validator() as jest.Mocked<Validator>;
};

describe('Email Validator', () => {
    it('Should returns true if validator returns true', () => {
        const sut = makeSut();
        sut.isValid.mockReturnValueOnce(true);
        const isEmailValid = sut.isValid('valid_email@gmail.com');
        expect(isEmailValid).toBeTruthy();
    });

    it('Should returns false if validator returns false', () => {
        const sut = makeSut();
        sut.isValid.mockReturnValueOnce(false);
        const isEmailValid = sut.isValid('invalid_email');
        expect(isEmailValid).toBeFalsy();
    });
});