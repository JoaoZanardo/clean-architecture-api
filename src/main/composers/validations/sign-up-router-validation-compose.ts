import { CompareFieldsValidation } from "../../../validations/validators/";
import { EmailValidatorAdapter } from "../../../infra/validators";
import { Validation } from "../../../presentation/protocols";
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../validations/validators";

export class SignUpRouteValidationCompose {
    static compose(): ValidationComposite {
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field));
        }
        validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
        validations.push(new CompareFieldsValidation('passwordConfirmation', 'password'));
        return new ValidationComposite(validations);
    }
}