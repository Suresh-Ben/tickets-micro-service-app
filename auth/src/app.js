//import packages
const express = require('express');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorHandler, NotFoundError } = require('@sbticketsproject/shared');
require('express-async-errors');

//my-imports
const signUpRouter = require('./routes/signup');
const signInRouter = require('./routes/signin');
const currentUserRouter = require('./routes/current-user');
const signOutRouter = require('./routes/signout');

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
    throw new NotFoundError();
})

app.use(errorHandler);

module.exports = app;