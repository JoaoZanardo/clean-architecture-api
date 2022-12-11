import { EmailValidator } from '../interfaces/email-validator';
import validator from 'validator';

export class EmailValidatorImplementation implements EmailValidator {
    isValid(email: string) {
        return validator.isEmail(email);
    }
}