export interface Encrypter {
    compare(value: string, hash: string): Promise<Boolean>;
    hash(value: string): Promise<string>;
}