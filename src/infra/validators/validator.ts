import { EmailValidator } from '../../validations/protocols';
import validator from 'validator';

export class Validator implements EmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email);
    }
}