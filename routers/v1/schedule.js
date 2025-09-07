const express = require('express');
const { query } = require('../../helper/getCon');
const { requireRole } = require('../../helper/permission');
const { Event, EventType, EventUtils } = require('../../models/Event');
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

router.get("", requireRole("view-profile"), (req, res) => {
    const { courseId, lecturerId, roomId, studyGroup, type, startTime, endTime } = req.query;
    console.log(req.user);

    // Filter mit dem neuen Event.filter System
    const filters = {};
    if (courseId) filters.courseId = courseId;
    if (lecturerId) filters.lecturer = lecturerId;
    if (roomId) filters.roomId = roomId;
    if (studyGroup) filters.studyGroup = studyGroup;
    if (type) filters.type = type;
    if (startTime && endTime) {
        filters.startTime = startTime;
        filters.endTime = endTime;
    }

    let result = Event.filter(exampleEvents, filters);

    if (result.length === 0) {
        return res.status(404).json({ error: "No entries found" });
    }

    // Gruppierung nach Datum
    const groupedByDate = EventUtils.groupByDate(result);

    res.json(groupedByDate);
});

router.get("/personal", requireRole("view-profile"), (req, res) => {
    const { courseId, lecturerId, roomId, studyGroup, type } = req.query;
    console.log(req.user);

    // Filter für persönliche Termine
    const filters = {};
    if (courseId) filters.courseId = courseId;
    if (lecturerId) filters.lecturer = lecturerId;
    if (roomId) filters.roomId = roomId;
    if (studyGroup) filters.studyGroup = studyGroup;
    if (type) filters.type = type;

    let result = Event.filter(exampleEvents, filters);

    if (result.length === 0) {
        return res.status(404).json({ error: "No entries found" });
    }

    // Sortierung nach Zeit
    result = EventUtils.sortByTime(result);

    // Gruppierung nach Datum
    const groupedByDate = EventUtils.groupByDate(result);

    res.json(groupedByDate);
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

module.exports = router;