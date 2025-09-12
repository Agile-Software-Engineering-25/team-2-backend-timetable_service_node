const logger = require("../logger");
const { createPromissesPost } = require("./createPromisses");
const mockData = require('../../mock/mock-data.json')

async function getGroupyId(ids) {
    if (process.env.NODE_ENV === 'test') {

        const groups = mockData.gruppen;
        const results = groups.filter(group => ids.includes(group.id))
        return results;
    } else {
        const URL = process.env.BASE_URL + "v1/group"
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

module.exports = { getGroupyId }