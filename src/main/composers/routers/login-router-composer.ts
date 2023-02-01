import { LoginRouter } from "../../../presentation/routers";
import { LoginRouterValidationCompose } from "../validations";
import { AuthUseCaseCompose } from "../usecases/";

export class LoginRouterCompose {
    static compose() {
        const authUseCase = AuthUseCaseCompose.compose();
        const validation = LoginRouterValidationCompose.compose()
        return new LoginRouter(authUseCase, validation);
    }
}