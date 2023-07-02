//import packages
const express = require('express');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorHandler, NotFoundError } = require('@sbticketsproject/shared');
require('express-async-errors');

//my-imports
const Tickets = require('./routes/tickets');
const FindTicket = require('./routes/ticket');
const NewTicket = require('./routes/new');
const UpdateTicket = require('./routes/update');

//inits
const app = express();
app.set('trust proxy', true); //cause requests come from ingress - like a middleware proxy
app.use(json());
app.use(cookieParser({
    secure: true,
    httpOnly: true
}));

//routes
app.use(Tickets);
app.use(FindTicket);
app.use(NewTicket);
app.use(UpdateTicket);
app.all('*', async() => {
    throw new NotFoundError();
})

app.use(errorHandler);

module.exports = app;