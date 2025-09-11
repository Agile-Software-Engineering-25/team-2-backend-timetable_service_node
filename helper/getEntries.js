const { query } = require("./getCon");
const logger = require("./logger");

async function getEntries(filter, user = null) {
    const filters = [];
    const params = [];

    if (user.lecturer) {
        filter.lecturer = lecturer;
    }
    // Basisabfrage
    let getEntries = "SELECT * FROM events"
    if (filter.courseId) {
        filters.push("course_id = ?");
        params.push(filter.courseId)
    }
    if (filter.lecturerId) {
        filters.push("lecturerId = ?");
        params.push(filter.lecturerId)
    }
    if (filter.roomId) {
        filters.push("roomId = ?");
        params.push(filter.roomId)
    }
    if (filter.studyGroup) {
        filters.push("studyGroup = ?");
        params.push(filter.studyGroup)
    }
    if (filter.startTime) {
        filters.push("startTime >= ?");
        params.push(filter.startTime)
    }
    if (filter.endTime) {
        filters.push("endTime <= ?");
        params.push(filter.endTime)
    }
    // Filter anhängen
    if (filters.length > 0) {
        getEntries += 'WHERE ' + filters.join(" AND ");
    }
    getEntries += " GROUP BY time "
    // Sortierung und Paginierung
    getEntries += " ORDER BY time ";
    try {
        const entries = await query(getEntries, params);
        return entries;
    }
    catch (error) {
        logger.error(error, "Error fetching filtered shedules");
        throw error;
    }

}
module.exports = { getEntries }