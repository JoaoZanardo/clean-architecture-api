export interface AuthUseCase {
    auth: (email: string, password: string) => Promise<null | string>;
}