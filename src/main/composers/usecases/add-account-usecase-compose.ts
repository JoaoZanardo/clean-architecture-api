import { AddAcountUseCaseService } from "../../../data/usecases";
import { AddAccount } from "../../../domain/usecases";
import { EncrypterAdapter } from "../../../infra/cryptography";
import { MongoDBAddAccountRepository, MongoDBLoadUserByEmailRepository } from "../../../infra/repositories";

export class AddAcountUseCaseCompose {
    static compose(): AddAccount {
        const addAccountRepository = new MongoDBAddAccountRepository();
        const encrypter = new EncrypterAdapter();
        const loadUserByEmailRepository = new MongoDBLoadUserByEmailRepository();
        return new AddAcountUseCaseService(
            loadUserByEmailRepository,
            addAccountRepository,
            encrypter
        );
    }
}