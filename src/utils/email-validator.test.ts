import validator from "validator";

class EmailValidator {
    public isEmailValid = true;
    public email: string = 'null';

    isValid(email: string) {
        this.email = email;
        return validator.isEmail(email);
    }
}

const makeSut = () => {
    return new EmailValidator();
};

describe('Email Validator', () => {
    it('Should returns true if validator returns true', () => {
        const sut = makeSut();
        const isEmailValid = sut.isValid('valid_email@gmail.com');
        expect(isEmailValid).toBeTruthy();
    });
    it('Should returns false if validator returns false', () => {
        const sut = makeSut();
        sut.isEmailValid = false;
        const isEmailValid = sut.isValid('invalid_email');
        expect(isEmailValid).toBeFalsy();
    });

    it('Should call validator with correct email', () => {
        const sut = makeSut();
        sut.isValid('any_email@gmail.com');
        expect(sut.email).toEqual('any_email@gmail.com');
    });
});