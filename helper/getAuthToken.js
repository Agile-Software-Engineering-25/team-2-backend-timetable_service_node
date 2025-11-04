import logger from "./logger.js";
import qs from "qs";

export async function getAuthToken() {
    const loginData = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials"
    };
    const url = process.env.AUTH_URL;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: qs.stringify(loginData),
            credentials: "include", // Cookies mit der Anfrage senden
        });
        if (!response.ok) {
            throw new Error("Could not create API key")
        }
        const responseData = await response.json();
        const token = responseData.access_token;
        logger.info(`New API key created`);
        logger.debug(`New API key created: ${token}`);
        process.env.AUTH_TOKEN = token;
    } catch (error) {
        logger.error(error, "Error creating new API key");
    }
}