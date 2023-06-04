import RequiredParam from "../utils/required-params.js";
import { InvalidAuthTokenError } from "../utils/errors.js";
import { MakeAuthenticationService } from "./authenticate.service.js";

const AuthenticationService = MakeAuthenticationService({ RequiredParam, InvalidAuthTokenError })
export {AuthenticationService }