 import {RequiredParameterError}  from "./errors.js";
 export default function RequiredParam(param_name) {

    throw new RequiredParameterError(param_name)

}
