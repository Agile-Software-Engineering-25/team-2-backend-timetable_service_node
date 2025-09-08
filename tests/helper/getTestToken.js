const { generateAccessToken } = require("../../helper/accessToken")

function generateTestToken() {
    return generateAccessToken({
        "realm_access": {
            "roles": [
                "testabc",
                "offline_access",
                "uma_authorization",
                "default-roles-hvs2"
            ]
        },
        "resource_access": {
            "account": {
                "roles": [
                    "manage-account",
                    "manage-account-links",
                    "view-profile"
                ]
            }
        },
        "scope": "openid email profile",
        "email_verified": false,
        "name": "Luca Schmitz",
        "preferred_username": "test2",
        "given_name": "Luca",
        "family_name": "Schmitz",
        "email": "newuser@example.com"
    })
}

module.exports = { generateTestToken }
