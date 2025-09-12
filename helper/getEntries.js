const { query } = require("./getCon");
const logger = require("./logger");

async function getEntries(filter, user = null) {
    const filters = [];
    const params = [];

    // if (user.lecturer) {
    //     filter.lecturer = lecturer;
    // }
    // Basisabfrage
    let getEntries = "SELECT * FROM events"
    if (filter.courseId) {
        filters.push("course_id = ?");
        params.push(filter.courseId)
    }
    if (filter.lecturerId) {
        filters.push("lecturer_id = ?");
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
        getEntries += ' WHERE ' + filters.join(" AND ");
    }
    getEntries += " GROUP BY time "
    // Sortierung und Paginierung
    getEntries += " ORDER BY time ";
    try {
        logger.info(`Query: ${getEntries} | Parms: ${params}`)
        const entries = await query(getEntries, params);
        const result = [];
        logger.debug(entries)
        entries.forEach(entry => {
            result.push({
                title: entry.title,
                room_id: entry.room_id,
                lecturer_id: entry.lecturer_id,
                group_id: entry.group_id,
                start_time: entry.time,
                end_time: entry.end_time,
                course_id: entry.course_id
            })
        });
        return result;
    }
    catch (error) {
        logger.error(error, "Error fetching filtered shedules");
        throw error;
    }

}
module.exports = { getEntries }