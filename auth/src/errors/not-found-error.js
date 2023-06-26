const CustomError = require('./custom-error');

module.exports = class NotFound extends CustomError {
    constructor() {
        super('path is undefined');
        this.statusCode = 400;
    }

    serializeErrors = () => {
        return [
            { message: this.message }
        ];
    }
}