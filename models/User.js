const logger = require("../helper/logger.js");

class UserModel {
    constructor() {
    }
    async getUserById(userId, token) {
        const url = "https://sau-portal.de/team-11-api/api/v1/users/" + userId;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "Content-Type: application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const responseData = await response.json()
                logger.error(responseData)
                throw new Error(`Could not get user: ${JSON.stringify(responseData)}} `)
            } else {
                return await response.json()
            }

        } catch (error) {
            logger.error(error, "Error fetching user data");
            throw error
        }
    }

}

module.exports = UserModel;