export interface LoadUserByEmailRepository<T> {
    load: (email: string) => Promise<T | null>;
}