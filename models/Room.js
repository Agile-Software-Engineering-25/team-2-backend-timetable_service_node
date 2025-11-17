const { randomUUID } = require("crypto");
const logger = require("../helper/logger.js");

class RoomModel {
    constructor() {
    }
    async bookRoom(event) {
        console.log(event)
        const roomBody = {
            roomId: event.room_id,
            lecturerIds: [
                event.lecturer_id
            ],
            studentGroupNames: [
                randomUUID()
            ],
            groupSize: 1,
            startTime: event.time,
            endTime: event.endTime
        }
        const url = "https://sau-portal.de/ase-1/room-mgmt/rooms/bookings";
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
                const responseData = await response.json()
                logger.error(responseData)
                throw new Error("Could not book room")
            }

        } catch (error) {
            logger.error(error, "Error creating new API key");
            throw error
        }
    }

}

module.exports = RoomModel;