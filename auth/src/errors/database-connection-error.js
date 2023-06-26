const CustomError = require('./custom-error');

module.exports = class DatabaseConnectionError extends CustomError {
    constructor() {
        super('Database connection error');
        this.statusCode = 500;
    }

    serializeErrors = () => {
        return [
            { message: this.message }
        ];
    }
}