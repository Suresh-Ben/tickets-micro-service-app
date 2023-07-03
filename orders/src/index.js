const mongoose = require('mongoose');
const { DatabaseConnectionError } = require('@sbticketsproject/shared');
const { nats } = require('@sbticketsproject/shared');

//my-imports
const app = require('./app');

//app start
const start = async() => {
    // check secret variables
    if (!process.env.JWT_KEY) throw new Error('Error with JWT_KEY');
    if (!process.env.MONGO_URI) throw new Error('Error with MONGO_URI');
    if (!process.env.NATS_URI) throw new Error('Error with NATS_URI');
    if (!process.env.NATS_CLIENT_ID) throw new Error('Error with NATS_CLIENT_ID');

    //setup Mongoose
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDb');
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    //setup nats
    try {
        nats.connect(process.env.NATS_CLIENT_ID, process.env.NATS_URI);
    } catch (err) {
        console.log('Error connecting to stan');
    }

    //app listren
    app.listen(3000, () => {
        console.log('Orders service is listening on port 3000!!!');
    });
}
start();