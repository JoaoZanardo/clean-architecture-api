import { User } from "../../domain/entities";
import { LoadUserByEmailRepository } from "../../data/protocols/db";
import mongoHelper from "../helpers/mongo-helper";

export class MongoDBLoadUserByEmailRepository implements LoadUserByEmailRepository {
    async load(email: string): Promise<User | null> {
        const userModel = await mongoHelper.getCollection('users');
        const user = await userModel.findOne({ email }, {
            projection: {
                password: 1
            }
        });
        if (!user) return null;
        return {
            id: user._id.toString(),
            password: user.password
        };
    }
}