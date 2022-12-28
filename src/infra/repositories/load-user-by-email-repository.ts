import { Collection, Document, WithId } from "mongodb";
import { LoadUserByEmailRepository } from "../../interfaces/load-user-by-email-repository";

export class DbLoadUserByEmailRepository implements LoadUserByEmailRepository<WithId<Document>> {
    constructor(private userModel: Collection<Document>) { }

    async load(email: string): Promise<WithId<Document> | null> {
        const user = await this.userModel.findOne({ email }, {
            projection: {
                password: 1
            }
        });
        return user;
    }
}