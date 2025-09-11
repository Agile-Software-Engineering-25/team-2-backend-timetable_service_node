const { getCourseById } = require("../../helper/resolveIds/coursId");
const mockData = require("../../mock/mock-data.json")

test('Returns course data to a given list of Course Ids', async () => {
    const courseIds = ["6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24", "a26b44c1-40df-4486-9095-d9bc5e4449d7", "c9a6e4a3-b3d7-45a1-9d1c-5c6a4e8f0a9d", "edb791e0-f1c7-45d1-bd9c-4368bc92c10c", "28a9df4e-312d-44b3-bb7c-998e21bb8b07"];

    const [singleCourse] = await getCourseById(courseIds[0]);
    const courses = await getCourseById(courseIds);
    expect(singleCourse).toEqual(mockData.kurse[0]);
    expect(courses).toEqual(mockData.kurse);
})