import logger from "./logger.js";

export class RoomModel {
    async bookRoom(event) {
        const roomBody = {
            roomId: event.room_id,
            lecturerIds: [
                event.lecturer_id
            ],
            studentGroupNames: [
                event.studyGroup
            ],
            groupSize: 1,
            startTime: time,
            endTime: endTime
        }
        const url = "https://api.provadis.com/v1/rooms/inquiry";
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
            }

        } catch (error) {
            logger.error(error, "Error creating new API key");
        }
    }

}
