const express = require('express');
const { query } = require('../../helper/getCon');
const { requireRole } = require('../../helper/permission');
const { Event, EventType } = require('../../models/Event');
const { getEntries } = require('../../helper/getEntries');
const logger = require('../../helper/logger');
const router = express.Router();

// Beispiel-Events mit dem neuen Datenmodell
const exampleEvents = [

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
        const result = await getEntries({})
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