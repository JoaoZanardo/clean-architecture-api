import { Collection, Db, Document, MongoClient } from 'mongodb';

class MongoHelper {
    private client: MongoClient | null = null;

    async connect(uri: string, dbName: string): Promise<{ client: MongoClient, db: Db }> {
        this.client = await MongoClient.connect(uri, {});
        return { client: this.client, db: this.client.db(dbName) };
    }
    
    async disconnect(): Promise<void> {
        await this.client?.close();
    }
}

export default new MongoHelper();