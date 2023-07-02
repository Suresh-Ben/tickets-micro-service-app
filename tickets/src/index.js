const mongoose = require('mongoose');
const { DatabaseConnectionError } = require('@sbticketsproject/shared');
const { nats } = require('@sbticketsproject/shared');

//my-imports
const app = require('./app');

//app start
const start = async() => {
    // check secret variables
    if (!process.env.JWT_KEY) throw new Error('Error with JWT_KEy');

    //setup Mongoose
    try {
        await mongoose.connect('mongodb://tickets-mongo-cluster-service:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDb');
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    //setup nats
    try {
        nats.connect('ticketing-service', 'http://nats-service:4222');
        console.log('connected to nats!!!');
    } catch (err) {
        console.log('Error connecting to stan');
    }

    //app listren
    app.listen(3000, () => {
        console.log('Tickets servixe is listening on port 3000!!!');
    });
}
start();