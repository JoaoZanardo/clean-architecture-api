import { LoadUserByEmailRepository } from "../../interfaces/load-user-by-email-repository";
import mongoHelper from "../helpers/mongo-helper";
import { User } from "src/interfaces/user";

export class MongoLoadUserByEmailRepository implements LoadUserByEmailRepository<User | null> {
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