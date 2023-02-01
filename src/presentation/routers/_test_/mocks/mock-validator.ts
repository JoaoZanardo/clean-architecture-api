import { Validation } from "../../../../presentation/protocols";

export class ValidatorSpy implements Validation {
    public input: any;
    public error: Error | undefined;

    validate(input: any): Error | void {
        this.input = input;
        return this.error;
    }
}