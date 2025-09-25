const request = require('supertest');
const { app, startServer } = require('../../app.js');

const { generateTestToken } = require('../helper/getTestToken.js');
const { query } = require('../../helper/getCon.js');
const { getEntries } = require('../../helper/getEntries.js');
let server
beforeAll(async () => {
    server = await startServer()
    const createTable = `
        CREATE TABLE IF NOT EXISTS events(
                id TEXT PRIMARY KEY,
                time TEXT NOT NULL,
                end_time TEXT,
                title TEXT NOT NULL,
                room_id TEXT NOT NULL,
                course_id TEXT NOT NULL,
                study_group TEXT NOT NULL,
                lecturer_id TEXT NOT NULL,
            type TEXT CHECK(type IN('Kurs', 'Dekansprechstunde', 'Klausureinsicht', 'Prüfung', 'E-Learning', 'Sonstiges')) DEFAULT 'Kurs',
                group_id TEXT, --Optional
            created_at TEXT NOT NULL DEFAULT(datetime('now'))
            );
        `;
    const insertSampleData = `
                INSERT OR IGNORE INTO events(id, time, end_time, title, room_id, course_id, study_group, lecturer_id, type, group_id)
                VALUES
                ('6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24', '2025-10-01 08:00', '2025-10-01 10:00', 'Programmierung I', 'R101', '6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24', 'INF101', '15389065-daf0-4a2e-bae5-2e3f024a7921', 'Kurs', 'GroupID'),

                ('a26b44c1-40df-4486-9095-d9bc5e4449d7', '2025-10-02 10:00', '2025-10-02 12:00', 'Statistik', 'R202', 'a26b44c1-40df-4486-9095-d9bc5e4449d7', 'DS210', 'e2193aa1-63a0-470a-b6ed-3bcbb73d42db', 'Kurs', 'GroupID'),

                ('c9a6e4a3-b3d7-45a1-9d1c-5c6a4e8f0a9d', '2025-10-03 12:00', '2025-10-03 14:00', 'Software Engineering', 'R303', 'c9a6e4a3-b3d7-45a1-9d1c-5c6a4e8f0a9d', 'INF330', 'ca4dfda5-6a7d-46f1-88e2-18d178f2d890', 'Kurs', 'GroupID'),

                ('edb791e0-f1c7-45d1-bd9c-4368bc92c10c', '2025-10-04 14:00', '2025-10-04 16:00', 'Algorithmen Tutorium', 'R404', 'edb791e0-f1c7-45d1-bd9c-4368bc92c10c', 'INF150', 'ca4dfda5-6a7d-46f1-88e2-18d178f2d890', 'Kurs', 'GroupID'),

                ('28a9df4e-312d-44b3-bb7c-998e21bb8b07', '2025-10-10 09:00', '2025-10-10 11:00', 'Programmierung I Klausur', 'R999', '28a9df4e-312d-44b3-bb7c-998e21bb8b07', 'INF101K', '15389065-daf0-4a2e-bae5-2e3f024a7921', 'Prüfung', 'GroupID');
    `;
    await query(createTable)
    await query(insertSampleData)
});

afterEach(async () => {
    // await query('DELETE FROM events');
});

afterAll(async () => {
    if (server) server.close()           // stop HTTP server
});

describe('GET /api/v1/event/:id', () => {
    it('should get scheduled event by id', async () => {

        const eventId = "6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24"
        const response = await request(app)
            .get('/api/v1/event/' + eventId)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        const singleEvent = response.body;
        expect(singleEvent).toEqual(
            expect.objectContaining({// prüft, dass Property existiert
                id: eventId,
                time: expect.any(String),
                endTime: expect.any(String),
                title: expect.any(String),
                roomId: expect.any(String),
                lecturer: expect.any(String),
                courseId: expect.any(String),
                groupId: expect.any(String),
                studyGroup: expect.any(String),
                type: expect.any(String),
                created_at: expect.any(String),
            })
        );
    });
});
describe('POST /api/v1/event', () => {
    it('should get all scheduled events', async () => {

        const event = {
            time: '2025-10-01 08:00',
            endTime: '2025-10-01 10:00',
            title: 'Programmierung I',
            roomId: 'R101',
            courseId: '6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24',
            lecturer: '15389065-daf0-4a2e-bae5-2e3f024a7921',
            type: 'Kurs',
            groupId: 'GroupID',
            studyGroup: 'Inf-Bin1',
        }
        const response = await request(app)
            .post('/api/v1/event')
            .send(event)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({// prüft, dass Property existiert
                id: expect.any(String),
                time: expect.any(String),
                endTime: expect.any(String),
                title: expect.any(String),
                roomId: expect.any(String),
                lecturer: expect.any(String),
                groupId: expect.any(String),
                courseId: expect.any(String),
                studyGroup: expect.any(String),
                type: expect.any(String),
            })
        );
        const [eventResp] = await getEntries({ id: response.body.id })
        expect(eventResp).toEqual(expect.objectContaining(event))
    });
});
describe('DELETE /api/v1/event/:id', () => {
    it('should delete a scheduled event', async () => {
        const eventId = '6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24';
        const response = await request(app)
            .delete('/api/v1/event/' + eventId)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        const [eventResp] = await getEntries({ id: response.body.id })
        expect(eventResp).toBe(undefined)
    });
});
describe('PUT /api/v1/event', () => {
    it('should get update a scheduled event', async () => {

        const event = {
            id: '6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24',
            time: '2025-10-01 08:00',
            endTime: '2025-10-01 10:00',
            title: 'Programmierung II',
            roomId: 'R101',
            courseId: '6ad7b8c8-0b23-4e1a-8d8f-4a9f1b4f0e24',
            lecturer: '15389065-daf0-4a2e-bae5-2e3f024a7921',
            type: 'Kurs',
            groupId: 'GroupID',
            studyGroup: 'Inf-Bin1',
        }
        const response = await request(app)
            .put('/api/v1/event/' + event.id)
            .send(event)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toEqual(
            expect.objectContaining({// prüft, dass Property existiert
                id: expect.any(String),
                time: expect.any(String),
                endTime: expect.any(String),
                title: expect.any(String),
                roomId: expect.any(String),
                lecturer: expect.any(String),
                groupId: expect.any(String),
                courseId: expect.any(String),
                studyGroup: expect.any(String),
                type: expect.any(String),
            })
        );
        const [eventResp] = await getEntries({ id: response.body.id })
        expect(eventResp).toEqual(expect.objectContaining(event))
    });
});

