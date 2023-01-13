import { EmailValidator } from "src/interfaces/email-validator";

export class EmailValidatorSpy implements EmailValidator {
    public isEmailValid: boolean = true;

    isValid(email: string): boolean {
        return this.isEmailValid;
    }
}