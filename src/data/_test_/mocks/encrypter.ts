import { Encrypter } from "../../protocols/cryptography";

export class EncrypterSpy implements Encrypter {
    public isValid: boolean = true;

    async compare(value: string, hash: string): Promise<Boolean> {
        return this.isValid;
    }

    async hash(value: string): Promise<string> {
        return 'hashed_value';
    }
}