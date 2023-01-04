import { Collection, Db, Document, MongoClient } from 'mongodb';

class MongoHelper {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(uri: string, dbName: string): Promise<{ client: MongoClient, db: Db }> {
        this.client = await MongoClient.connect(uri, {});
        return { client: this.client, db: this.client.db(dbName) };
    }

    async getColletion(name: string): Promise<Collection<Document> | null> {
        if (!this.client || !this.db) return null;
        return this.db.collection(name);
    }

    async disconnect(): Promise<void> {
        if (!this.client) return;
        await this.client.close();
    }
}

export default new MongoHelper();