import { InvalidParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols";
import { EmailValidator } from "../protocols";

export class EmailValidation implements Validation {
    constructor(
        private fieldName: string,
        private emailValidator: EmailValidator
    ) { }

    validate(input: any): void | Error {
        const isValid = this.emailValidator.isValid(input[this.fieldName]);
        if (!isValid) return new InvalidParamError(this.fieldName);
    }
}