const logger = require("../helper/logger.js");

class UserModel {
    constructor() {
    }
    async getUserById(userId) {
        const url = "https://sau-portal.de/team-11-api/api/v1/users/" + userId;
        const token = process.env.AUTH_TOKEN
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "Content-Type: application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include", // Cookies mit der Anfrage senden
            });

            if (!response.ok) {
                logger.info(response.status)
                logger.info(url)
                logger.error(response)
                throw new Error("Could not get user")
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