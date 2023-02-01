import { Validation } from "../../presentation/protocols";
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../validations/validators";
import { Validator } from "../../infra/validators";

export class LoginRouterValidationCompose {
    static compose() {
        const validations: Validation[] = [];
        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field));
        }
        validations.push(new EmailValidation('email', new Validator()));
        return new ValidationComposite(validations);
    }
}