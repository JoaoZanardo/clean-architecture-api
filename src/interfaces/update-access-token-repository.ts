export interface UpdateAccessTokenRepository {
    update(userId: string, token: string | null): Promise<void>;
}