import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validation {
    constructor(private field: string) {}

    validate(input: any): Error | void {
        if (!input[this.field]) return new MissingParamError(this.field);
    };
}