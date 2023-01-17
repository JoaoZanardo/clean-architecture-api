import { EmailValidator } from "../../../../validations/protocols";

export class EmailValidatorSpy implements EmailValidator {
    public isEmailValid: boolean = true;

    isValid(email: string): boolean {
        return this.isEmailValid;
    }
}