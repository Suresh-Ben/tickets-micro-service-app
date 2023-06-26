//import packages
const express = require('express');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
require('express-async-errors');

//my-imports
const signUpRouter = require('./routes/signup');
const signInRouter = require('./routes/signin');
const currentUserRouter = require('./routes/current-user');
const signOutRouter = require('./routes/signout');
const errorHandler = require('./middlewares/error-handler');
const NotFound = require('./errors/not-found-error');
const DatabaseConnectionError = require('./errors/database-connection-error');

//inits
const app = express();
app.set('trust proxy', true); //cause requests come from ingress - like a middleware proxy
app.use(json());
app.use(cookieParser({
    secure: true,
    httpOnly: true
}));

//routes
app.use(signUpRouter);
app.use(signInRouter);
app.use(currentUserRouter);
app.use(signOutRouter);
app.all('*', async() => {
    throw new NotFound();
})

app.use(errorHandler);

module.exports = app;