const jwt = require("jsonwebtoken");
const fs = require("fs")
function generateAccessToken(payload) {
    const secret = fs.readFileSync('./keys/private.pem');

    return jwt.sign(payload, secret, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || 3600,
    });
}



module.exports = { generateAccessToken }