const jwt = require('jsonwebtoken');

function generateToken(username){
    const object = {
        username
    }
    return jwt.sign(object, process.env.JWT_KEY);
}

module.exports = generateToken