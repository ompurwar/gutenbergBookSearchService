import { AuthenticationService } from "../../service/index.js"

export default function MakeExpressCallback(controller) {
  return (req, res) => {
    const http_request = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      originalUrl:req.originalUrl,
      headers: {
        'Content-Type': req.get('Content-Type'),
        auth_token: req.get('auth-token'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent')
      },
      signedCookies: req.signedCookies,
      cookies: req.cookies
    }
    // console.log('auth')
    AuthenticationService.Authenticate(http_request).then(session => {
      http_request.session = session;

      controller(http_request).then(http_response => {

        // console.log(http_response)

        if (http_response.headers) {
          res.set(http_response.headers);
        }

        if (http_response.cookies) {
          for (const key in http_response.cookies) {
            if (Object.hasOwnProperty.call(http_response.cookies, key)) {
              const value = http_response.cookies[key];
              // console.log(value,key)
              // console.log(value,key,res.cookie)
              res.cookie(key, value, { maxAge: 24 * 60 * 60 * 1000, secure: true, signed: true });

            }
          }

          // res.cookie('session_id', http_request.session.id, { signed: true });
        }
        res.type('json')
        res.status(http_response.status_code).send(http_response.body);
      }).catch(e => {


        console.log(e);
        res.status(e.code ? '200' : 500)
          .send({
            error: {
              msg: GetErrorMessage(e),
              code: e.code ? e.code : 500
            },
            status: 'error',
            data: null
          });

      });

    }).catch((e) => {

      res.status(200).send({
        error: {
          msg: GetErrorMessage(e),
          code: 401
        },
        status: 'error',
        data: null
      });

    })
  }
}
function GetErrorMessage(error) {
  let message = error.message ? error.message : '';
  if (error.code === 500 || !error.code) {
    message = 'An unknown error occurred.';
  }
  return message;
}