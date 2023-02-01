import { SignUpRouter } from "../../../presentation/routers";
import { SignUpRouteValidationCompose } from "../validations";
import { AuthUseCaseCompose } from "../usecases";
import { AddAcountUseCaseCompose } from "../usecases";

export class SignUpRouterCompose {
    static compose() {
        const authUseCase = AuthUseCaseCompose.compose();
        const addAccountUseCase = AddAcountUseCaseCompose.compose();
        const validator = SignUpRouteValidationCompose.compose();
        return new SignUpRouter(
            validator,
            addAccountUseCase,
            authUseCase
        );
    }
}