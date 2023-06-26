const CustomError = require('./custom-error');

module.exports = class BadRequestError extends CustomError {
    constructor(message) {
        super(message || 'Bad request Error');
        this.statusCode = 400;
    }

    serializeErrors = () => {
        return [{
            errors: this.message
        }];
    }
}