export interface Encrypter {
    compare(value: string, hash: string): Promise<Boolean>;
}