import { Encrypter } from "../../../../interfaces/encrypter";

export class EncrypterSpy implements Encrypter {
    public isValid: boolean = true;
    public compareValues: string[] = [];

    async compare(value: string, hash: string): Promise<Boolean> {
        this.compareValues.push(value);
        this.compareValues.push(hash);
        return this.isValid;
    }
}