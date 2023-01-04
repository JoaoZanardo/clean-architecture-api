import { Document, WithId } from "mongodb";
import env from "../../main/config/env";
import { LoadUserByEmailRepository } from "../../interfaces/load-user-by-email-repository";
import mongoHelper from "../helpers/mongo-helper";

export class DbLoadUserByEmailRepository implements LoadUserByEmailRepository<WithId<Document>> {
    async load(email: string): Promise<WithId<Document> | null> {
        await mongoHelper.connect(env.mongoUrl);
        const userModel = await mongoHelper.getCollection('users');
        const user = await userModel.findOne({ email }, {
            projection: {
                password: 1
            }
        });
        return user;
    }
}