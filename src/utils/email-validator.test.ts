import validator from "validator";

class EmailValidator {
    public isEmailValid = true;

    isValid(email: string) {
        return validator.isEmail(email);
    }
}

const makeSut = () => {
    return new EmailValidator();
};

describe('Email Validator', () => {
    it('Should returns true if validator returns true', () => {
        const sut = makeSut();
        const isEmailValid = sut.isValid('valid_email@gmail.com')
        expect(isEmailValid).toBeTruthy();
    });
    it('Should returns false if validator returns false', () => {
        const sut = makeSut();
        sut.isEmailValid = false;
        const isEmailValid = sut.isValid('invalid_email')
        expect(isEmailValid).toBeFalsy();
    });
});