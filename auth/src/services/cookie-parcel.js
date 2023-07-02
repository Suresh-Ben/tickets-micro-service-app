const jwt = require('jsonwebtoken');

module.exports = function cookieParcel(res, id, email) {
    //generate jwt
    const token = jwt.sign({
        id: id,
        email: email
    }, process.env.JWT_KEY);

    //send it to user browser
    res.cookie('jwt', token);
}