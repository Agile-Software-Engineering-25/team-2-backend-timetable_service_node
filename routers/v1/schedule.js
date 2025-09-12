const express = require('express');
const { query } = require('../../helper/getCon');
const { requireRole } = require('../../helper/permission');
const { Event, EventType, EventUtils } = require('../../models/Event');
const { getEntries } = require('../../helper/getEntries');
const logger = require('../../helper/logger');
const router = express.Router();

// Beispiel-Events mit dem neuen Datenmodell
const exampleEvents = [
    new Event({
        time: "2025-07-23T10:00:00Z",
        endTime: "2025-07-23T12:00:00Z",
        title: "Database Systems II",
        roomId: "a4f3e1ab-003f-4b88-b4cd-6e6e22a5c9cd",
        courseId: "de305d54-75b4-431b-adb2-eb6b9e546014",
        studyGroup: "INF21A",
        lecturer: "Prof. Dr. Schmidt",
        type: EventType.KURS,
        groupId: "d1a113fd-d62e-4be1-92fc-2b0977c0c20d"
    }),
    new Event({
        time: "2025-07-23T14:00:00Z",
        endTime: "2025-07-23T15:30:00Z",
        title: "Sprechstunde Dekan",
        roomId: "b5g4f2bc-114g-5c99-c5de-7f7f33b6d0de",
        courseId: "SPRECHSTUNDE-001",
        studyGroup: "ALLE",
        lecturer: "Prof. Dr. Müller",
        type: EventType.DEKANSPRECHSTUNDE
    })
];

router.get("", requireRole("view-profile"), async (req, res) => {
    const filter = { courseId, lecturerId, roomId, studyGroup, type, startTime, endTime } = req.query;
    const userMail = req.user.email;
    /*
        User ID und die Gruppe mit Mail abfragen 
    */
    /*filter.studyGroup == */ //Hier setzen sobald implementiert
    try {
        const result = await getEntries(filter, userMail);
        if (result.length === 0) {
            return res.status(404).send("No Entries found");
        }
        return res.status(200).send(result)
    }
    catch (error) {
        return res.status(500).send("Inernal Server Error");
    }
});
router.get("/personal", requireRole("view-profile"), async (req, res) => {
    const filter = { courseId, lecturerId, roomId, studyGroup, type, startTime, endTime } = req.query;
    const userMail = req.user.email;

    /*
        User ID und die Gruppe mit Mail abfragen 
    */

    try {
        const result = await getEntries(filter, userMail);
        if (result.length === 0) {
            return res.status(404).send("No Entries found")
        }
        return res.status(200).send(result)
    }
    catch (error) {
        console.log(error)
        logger.error(error, `Could not fetch personal events ${JSON.stringify(filter)}`)
        return res.status(500).send("Inernal Server Error")
    }
});

// Neue Route für Event-Management
router.post("", requireRole("manage-schedule"), (req, res) => {
    try {
        const event = new Event(req.body);
        // Hier würde normalerweise die Datenbank-Speicherung erfolgen
        res.status(201).json(event.toJSON());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route für Konfliktprüfung
router.get("/conflicts", requireRole("view-profile"), (req, res) => {
    const conflicts = EventUtils.findConflicts(exampleEvents);
    res.json(conflicts);
});

// Route für verfügbare Event-Typen
router.get("/types", requireRole("view-profile"), (req, res) => {
    res.json(Object.values(EventType));
});

router.get("/all", requireRole("view-profile"), async (req, res) => {
    try {
        const result = await query("SELECT * FROM events")
        if (result.length == 0) {
            return res.status(404).send("No entries found")
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error)
        logger.error(error, "Error while fetching events from DB")
        return res.status(500).send("Internal Server Error")
    }
});

module.exports = router;