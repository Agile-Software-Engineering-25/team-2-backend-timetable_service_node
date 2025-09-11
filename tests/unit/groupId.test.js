const { getGroupyId } = require("../../helper/resolveIds/groupId");
const mockData = require("../../mock/mock-data.json")

test('Returns course data to a given list of group ids', async () => {
    const groupIds = [];
    mockData.gruppen.forEach(group => {
        groupIds.push(group.id)
    });
    const [singleGroup] = await getGroupyId(groupIds[0]);
    const groups = await getGroupyId(groupIds);
    expect(singleGroup).toEqual(mockData.gruppen[0]);
    expect(groups).toEqual(mockData.gruppen);
})