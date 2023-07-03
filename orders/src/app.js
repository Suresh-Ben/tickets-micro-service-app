//import packages
const express = require('express');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorHandler, NotFoundError } = require('@sbticketsproject/shared');
require('express-async-errors');

//my-imports
const Orders = require('./routes/orders');
const FindOrder = require('./routes/order');
const NewOrder = require('./routes/new');
const DeleteOrder = require('./routes/delete');

//inits
const app = express();
app.set('trust proxy', true); //cause requests come from ingress - like a middleware proxy
app.use(json());
app.use(cookieParser({
    secure: true,
    httpOnly: true
}));

//routes
app.use(Orders);
app.use(FindOrder);
app.use(NewOrder);
app.use(DeleteOrder);
app.all('*', async() => {
    throw new NotFoundError();
})

app.use(errorHandler);

module.exports = app;