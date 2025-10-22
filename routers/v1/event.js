const express = require('express');
const { query } = require('../../helper/getCon');
const { requireRole } = require('../../helper/permission');
const { Event, EventType, EventUtils } = require('../../models/Event');
const logger = require('../../helper/logger');
const { randomUUID } = require('crypto');
const { getEntries } = require('../../helper/getEntries');
const router = express.Router();

// Neue Route für Event-Management
router.get("/:id", requireRole("manage-schedule"), async (req, res) => {
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
router.post("/", requireRole("manage-schedule"), async (req, res) => {
    let event = {};
    try {
        event = new Event(req.body);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ err: error })
    }
    try {
        const event = new Event(req.body);
        id = randomUUID()
        const insertQuery = "INSERT INTO events (id, time, end_time, title, room_id, course_id, study_group, lecturer_id, type, group_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await query(insertQuery, [id, event.time, event.endTime, event.title, event.roomId, event.courseId, event.studyGroup, event.lecturer, event.type, event.groupId]);
        event.id = id;
        res.status(201).json(event.toJSON());
    } catch (error) {
        logger.error(error, `An error accured while creating event`)

        res.status(500).send("Internal Server Error");
    }
});
router.put("/:id", requireRole("manage-schedule"), async (req, res) => {
    let event = {};
    const eventId = req.params.id;
    try {
        event = new Event(req.body);
    } catch (error) {
        return res.status(400).json({ err: error })
    }
    try {
        const insertQuery = "UPDATE events SET time = ?, end_time = ?, title = ?, room_id = ?, course_id = ?, study_group = ?, lecturer_id = ?, type = ?, group_id = ? WHERE id = ?";
        await query(insertQuery, [event.time, event.endTime, event.title, event.roomId, event.courseId, event.studyGroup, event.lecturer, event.type, event.groupId, eventId]);
        res.status(200).json(event.toJSON());
    } catch (error) {
        logger.error(error, `An error accured while edeting event: ${eventId}`)
        res.status(500).send("Internal Server Error");
    }
});
router.delete("/:id", requireRole("manage-schedule"), async (req, res) => {
    const eventId = req.params.id;
    try {
        const insertQuery = "DELETE FROM events WHERE id = ?";
        await query(insertQuery, [eventId]);
        res.status(204);
    } catch (error) {
        logger.error(error, `An error accured while deleting event: ${eventId}`)
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
