export function MakeAuthenticationService({ RequiredParam, InvalidAuthTokenError }) {
    return Object.freeze({
        Authenticate
    })
    async function Authenticate({ headers = RequiredParam('headers'), path, signedCookies }) {
        if (['/books'].includes(path)) {
            return true;
        }
        let { auth_token } = headers;
        if (signedCookies && signedCookies.session_id)
            auth_token = signedCookies.session_id;

        // TODO: more complex auth logic can be added if needed
        if (auth_token) {
            return; // pass
        }
        // console.log(auth_token)
        throw new InvalidAuthTokenError();
    }
}