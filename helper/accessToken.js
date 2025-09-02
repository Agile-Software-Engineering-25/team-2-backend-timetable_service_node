const jwt = require("jsonwebtoken");
function generateAccessToken(user) {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME | 3600,
    });
}

// Erstellt das Refresh-Token
function generateRefreshToken(user) {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME | 360000,
    });
}

module.exports = { generateAccessToken, generateRefreshToken }