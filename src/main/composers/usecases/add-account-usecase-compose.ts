import { AddAcountUseCaseService } from "../../../data/usecases";
import { AddAccount } from "../../../domain/usecases";
import { EncrypterAdapter } from "../../../infra/cryptography";
import { MongoAddAccountRepository, MongoDBLoadUserByEmailRepository } from "../../../infra/repositories";

export class AddAcountUseCaseComposer {
    static compose(): AddAccount {
        const addAccountRepository = new MongoAddAccountRepository();
        const encrypter = new EncrypterAdapter();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        return new AddAcountUseCaseService(
            loadUserByEmailRepository,
            addAccountRepository,
            encrypter
        );
    }
}