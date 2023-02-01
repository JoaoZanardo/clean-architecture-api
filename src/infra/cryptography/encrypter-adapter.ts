import bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/cryptography';

export class EncrypterAdapter implements Encrypter {
    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }

    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, 10)
    }
}