import { Encrypter } from "../../../../interfaces/encrypter";

export class EncrypterSpy implements Encrypter {
    public isValid: boolean = true;

    async compare(value: string, hash: string): Promise<Boolean> {
        return this.isValid;
    }
}