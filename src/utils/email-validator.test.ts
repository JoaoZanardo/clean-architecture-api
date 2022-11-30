class EmailValidator {
    isValid(email: string) {
        return true;
    }
}

const makeSut = () => {
    return new EmailValidator();
};

describe('Email Validator', () => {
    it('Should returns true if validator returns true', () => {
        const sut = makeSut();
        const isEmailValid = sut.isValid('email')
        expect(isEmailValid).toBeTruthy();
    });
});