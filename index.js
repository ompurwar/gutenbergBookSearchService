
import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { config } from 'dotenv';
config()
import express from 'express'

import bodyParser from 'body-parser'

// import passport from 'passport';
// import cookieParser from 'cookie-parser';
// import express_session from 'express-session';
// import './passport.js';
// console.log(process.env)

import MakeExpressCallBack from './src/adapters/express_adapter/express_http_adapter.js'
import SearchBookController from './src/controllers/books/searchBooks.js';

const app = express()

app.use(bodyParser.json())



app.use(function (req, res, next) {

    // Website you wish to allow to connect


    // Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET'
    );

    // Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers',
        // '*'
        'X-Requested-With,content-type,AuthToken,baggage,sentry-trace'
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// app.use(express_session({ secret: 'cats'}));
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/alive', function (req, res) {
    res.send('I AM AlIVE!!');
});

app.get('/', function (req, res) {
    res.send('success').status(200);
});

app.get('/session', (req, res) => {
    res.json(req.user);
    console.log(req.user, req.signedCookies.session_id)
})



app.get('/books', MakeExpressCallBack(SearchBookController))


app.use((error, req, res, next) => {
    if (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' })
    }
})
if (process.env.NODE_ENV === 'DEV')
    app.listen(3000, () => console.log(`Listening on port 3000`))

export default app;