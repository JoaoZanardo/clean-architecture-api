import { SignUpRouter } from "../../presentation/routers/";
import { SignUpRouteValidationCompose } from "./sign-up-router-validation-compose";
import { AuthUseCaseComposer } from "./auth-usecase-compose";
import { AddAcountUseCaseComposer } from "./add-account-usecase-compose";

export class SignUpRouterCompose {
    static compose() {
        const authUseCase = AuthUseCaseComposer.compose();
        const addAccountUseCase = AddAcountUseCaseComposer.compose();
        const validator = SignUpRouteValidationCompose.compose();
        return new SignUpRouter(
            validator,
            addAccountUseCase,
            authUseCase
        );
    }
}