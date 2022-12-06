import bcrypt from 'bcrypt';

export class EncrypterImplementation {
    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}