const mongoose = require('mongoose');
const { DatabaseConnectionError } = require('@sbticketsproject/shared');

//my-imports
const app = require('./app');

//app start
const start = async() => {
    //check secret variables
    if (!process.env.JWT_KEY) throw new Error('Error with JWT_KEY');
    if (!process.env.MONGO_URI) throw new Error('Error with MONGO_URI');


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

    //app listren
    app.listen(3000, () => {
        console.log('Auth servixe is listening on port 3000!!!');
    });
}
start();