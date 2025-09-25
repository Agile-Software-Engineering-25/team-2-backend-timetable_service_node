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

    if (filter.id) {
        filters.push("id = ?");
        params.push(filter.id)
    }

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
                id: entry.id,
                title: entry.title,
                roomId: entry.room_id,
                lecturer: entry.lecturer_id,
                groupId: entry.group_id,
                time: entry.time,
                endTime: entry.end_time,
                courseId: entry.course_id,
                type: entry.type,
                created_at: entry.created_at || "",
                studyGroup: entry.study_group
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