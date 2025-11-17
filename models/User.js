const logger = require("../helper/logger.js");

class UserModel {
    constructor() {
    }
    async getUserById(userId) {
        const url = "https://sau-portal.de/team-11-api/api/v1/users/" + userId;
        const token = process.env.AUTH_TOKEN
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "Content-Type: application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(roomBody),
                credentials: "include", // Cookies mit der Anfrage senden
            });

            if (!response.ok) {
                throw new Error("Could not book room")
            } else {
                return response.json()
            }

        } catch (error) {
            logger.error(error, "Error creating new API key");
            throw error
        }
    }

}

module.exports = UserModel;