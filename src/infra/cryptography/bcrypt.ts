import bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/cryptography';

export class Bcrypt implements Encrypter {
    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}