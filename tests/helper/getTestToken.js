//Massiver Copy Paste aus meinem Projekt und dient nur der Struktur
///////
///////

///////

///////
///////
///////

///////

const { generateAccessToken } = require("../../helper/accessToken")

function generateTestToken() {
    const user = {
        isAdmin: 1,
        id: 3,
        mail: "testUser@mail.com",
        roles: [],
        permissions: []
    }
    return generateAccessToken(user)
}

module.exports = { generateTestToken }
