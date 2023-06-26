const mongoose = require('mongoose');

//my-imports
const app = require('./app');

//app start
const start = async() => {
    //check secret variables
    if (!process.env.JWT_KEY) throw new Error('Error with JWT_KEy');

    //setup Mongoose
    try {
        await mongoose.connect('mongodb://auth-mongo-cluster-service:27017/auth', {
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