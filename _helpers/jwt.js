const jwt = require('jsonwebtoken');

function generateToken(objectUser){
    const payload = {
        id: objectUser.id,
        username: objectUser.username,
    }
    return jwt.sign(payload, process.env.JWT_KEY);
}

module.exports = generateToken