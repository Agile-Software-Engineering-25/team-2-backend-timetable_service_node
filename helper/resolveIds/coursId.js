const logger = require("../logger");
const { createPromissesPost } = require("./createPromisses");
const mockData = require('../../mock/mock-data.json')
async function getCourseById(ids) {
    if (process.env.NODE_ENV === 'test') {

        const courses = mockData.kurse;
        const results = courses.filter(course => ids.includes(course.id))
        return results;
    } else {
        const URL = process.env.BASE_URL + "v1/course"
        const requests = createPromissesPost(ids, URL)
        try {
            const responses = await Promise.all(requests);
            const results = await Promise.all(responses.map(res => res.json()));
            return results
        } catch (error) {
            logger.error(error, `Error while fetching lecturer data`)
            throw error
        }
    }
}

module.exports = { getCourseById }