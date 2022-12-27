export abstract class LoadUserByEmailRepository<T> {
    abstract load(email: string): Promise<T | null>
}