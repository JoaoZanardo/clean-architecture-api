import { LoginRouter } from "../../presentation/routers";
import { LoginRouterValidationCompose } from "./login-router-validation-composer";
import { AuthUseCaseComposer } from "./auth-usecase-compose";

export class LoginRouterCompose {
    static compose() {
        const authUseCase = AuthUseCaseComposer.compose();
        const validation = LoginRouterValidationCompose.compose()
        return new LoginRouter(authUseCase, validation);
    }
}