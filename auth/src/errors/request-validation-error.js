const CustomError = require('./custom-error');

module.exports = class RequestValidationError extends CustomError {
    constructor(errors) {
        super('Request validation error');
        this.resons = errors;
        this.statusCode = 400;
    }

    serializeErrors() {
        return this.resons.map((e) => {
            return { message: e.msg, field: e.path };
        });
    }
}