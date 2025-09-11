const { getLecturesById } = require("../../helper/resolveIds/lecturer");
const mockData = require("../../mock/mock-data.json")

test('Returns course data to a given list of lecturer IDs', async () => {
    const lecutrerIds = [];
    mockData.dozenten.forEach(lecutrer => {
        lecutrerIds.push(lecutrer.id)
    });
    const [singleLecturer] = await getLecturesById(lecutrerIds[0]);
    const lecturers = await getLecturesById(lecutrerIds);
    expect(singleLecturer).toEqual(mockData.dozenten[0]);
    expect(lecturers).toEqual(mockData.dozenten);
})