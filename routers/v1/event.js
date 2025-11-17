const express = require('express');
const { query } = require('../../helper/getCon');
const { requireRole } = require('../../helper/permission');
const { Event, EventType, EventUtils } = require('../../models/Event');
const logger = require('../../helper/logger');
const { randomUUID } = require('crypto');
const { getEntries } = require('../../helper/getEntries');
const router = express.Router();
const RoomModel = require("../../models/Room")
// Neue Route für Event-Management
const roomModel = new RoomModel()

router.get("/:id", requireRole("Area-1.Team-2.Read.Events"), async (req, res) => {
    const eventId = req.params.id;
    try {
        const [result] = await getEntries({ id: eventId });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).send(`Event with id ${eventId} not found`)
        }
    } catch (error) {
        logger.error(error, `An error accured while fetching event: ${eventId}`)

        res.status(500).send("Internal Server Error");
    }
});
router.post("/", requireRole("Area-1.Team-2.Read.Events"), async (req, res) => {
    let event = {};
    try {
        event = new Event(req.body);
    } catch (error) {
        logger.error(error)
        return res.status(400).json({ err: error })
    }
    logger.info(req.body)

    try {
        logger.info(event)
        await roomModel.bookRoom(event)
        id = randomUUID()
        const insertQuery = "INSERT INTO events (id, time, end_time, title, room_id, room_name,  study_group, lecturer_id, lecturer_name, type, module_name, comment) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await query(insertQuery, [id, event.time, event.endTime, event.title, event.room_id, event.room_name, event.studyGroup, event.lecturer_id, event.lecturer_name, event.type, event.module, event.comment ? event.comment : null]);
        event.id = id;
        res.status(201).json(await getEntries({ id: id })[0]);
    } catch (error) {
        logger.error(error, `An error accured while creating event`)

        res.status(500).send("Internal Server Error");
    }
});
router.put("/:id", requireRole("Area-1.Team-2.Read.Events"), async (req, res) => {
    let event = {};
    const eventId = req.params.id;
    try {
        event = new Event(req.body);
    } catch (error) {
        return res.status(400).json({ err: error })
    }
    try {
        const insertQuery = "UPDATE events SET time = ?, end_time = ?, title = ?, room_id = ?, room_name = ?, study_group = ?, lecturer_id = ?,lecturer_name = ?, type = ?, module_name = ?, comment = ? WHERE id = ?";
        await query(insertQuery, [event.time, event.endTime, event.title, event.room_id, event.room_name, event.studyGroup, event.lecturer_id, event.lecturer_name, event.type, event.module, event.comment ? event.comment : null, eventId]);
        const [response] = await getEntries({ id: eventId })
        res.status(200).json(response);
    } catch (error) {
        logger.error(error, `An error accured while edeting event: ${eventId}`)
        res.status(500).send("Internal Server Error");
    }
});
router.delete("/:id", requireRole("Area-1.Team-2.Delete.Events"), async (req, res) => {
    const eventId = req.params.id;
    try {
        const insertQuery = "DELETE FROM events WHERE id = ?";
        await query(insertQuery, [eventId]);
        res.status(204).end();
    } catch (error) {
        logger.error(error, `An error accured while deleting event: ${eventId}`)
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
