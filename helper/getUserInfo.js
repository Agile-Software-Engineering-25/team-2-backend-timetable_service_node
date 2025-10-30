const logger = require("./logger");

export async function getUser(userID) {
    try {
        const token = process.env.AUTH_TOKEN;
        // Fetch-Anfrage zum Erstellen des PDFs
        const publishResponse = await fetch(process.env.BASE_URL + `/team-11-api/api/v1/users/${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },

            credentials: "include", // Cookies mit der Anfrage senden
        });
        if (!publishResponse.ok) {
            throw new Error(`Fehler: ${responseData.status} - ${responseData.statusText} - ${JSON.stringify(responseData)}`);
        }

        logger.info("Offer ID: " + responseData.listingId + " Coin: ");
    } catch (error) {
        const logEntry = `Fehler beim Veröffentlichen des Konvoluts` +
            ` - Methode: POST` +
            ` - Daten: ${key}` +
            ` - Fehlermeldung: ${error.message}`;
        logger.error(error, logEntry);
        throw error;
    }
}