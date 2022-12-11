import bcrypt from 'bcrypt';
import { Encrypter } from '../interfaces/encrypter';

export class EncrypterImplementation implements Encrypter {
    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}