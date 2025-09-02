const express = require('express');
const { query } = require('../../helper/getCon');
const router = express.Router();

const examplePersonalEntry = {
    course_id: "de305d54-75b4-431b-adb2-eb6b9e546014",
    room_id: "a4f3e1ab-003f-4b88-b4cd-6e6e22a5c9cd",
    lecturer_id: "c8763eaa-e57f-49a1-bbfb-7f22d6e4a55c",
    group_id: "d1a113fd-d62e-4be1-92fc-2b0977c0c20d",
    start_time: "2025-07-23T10:00:00Z",
    end_time: "2025-07-23T12:00:00Z",
    title: "Database Systems II"
};

const exampleEntry = {
    courseId: "de305d54-75b4-431b-adb2-eb6b9e546014",
    roomId: "a4f3e1ab-003f-4b88-b4cd-6e6e22a5c9cd",
    lecturerId: "c8763eaa-e57f-49a1-bbfb-7f22d6e4a55c",
    groupId: "d1a113fd-d62e-4be1-92fc-2b0977c0c20d",
    startTime: "2025-07-23T10:00:00Z",
    endTime: "2025-07-23T12:00:00Z",
    title: "Database Systems II"
};

router.get("", (req, res) => {
    const { courseId, lecturerId, roomId } = req.query;

    // Filter-Beispiel (sehr rudimentär)
    let result = [exampleEntry];
    if (courseId && courseId !== exampleEntry.courseId) result = [];
    if (lecturerId && lecturerId !== exampleEntry.lecturerId) result = [];
    if (roomId && roomId !== exampleEntry.roomId) result = [];

    if (result.length === 0) {
        return res.status(404).json({ error: "No entries found" });
    }
    res.json({
        "2025-07-23": result
    });
});
router.get("/personal", (req, res) => {
    const { courseId, lecturerId, roomId } = req.query;

    let result = [examplePersonalEntry];
    if (courseId && courseId !== examplePersonalEntry.course_id) result = [];
    if (lecturerId && lecturerId !== examplePersonalEntry.lecturer_id) result = [];
    if (roomId && roomId !== examplePersonalEntry.room_id) result = [];

    if (result.length === 0) {
        return res.status(404).json({ error: "No entries found" });
    }

    res.json({
        "2025-07-23": result
    });
});


module.exports = router;