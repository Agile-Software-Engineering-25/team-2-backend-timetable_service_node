const request = require('supertest');
const { app, startServer } = require('../../app.js');

const { generateTestToken } = require('../helper/getTestToken.js');
const { query } = require('../../helper/getCon.js');
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

describe('GET /api/v1/schedule/all', () => {
    it('should get all scheduled events', async () => {


        const response = await request(app)
            .get('/api/v1/schedule/all')
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.length).toBe(5)
        const singleEvent = response.body[0]
        expect(singleEvent).toEqual(
            expect.objectContaining({// prüft, dass Property existiert
                time: expect.any(String),
                end_time: expect.any(String),
                title: expect.any(String),
                room_id: expect.any(String),
                course_id: expect.any(String),
                study_group: expect.any(String),
                type: expect.any(String),
                created_at: expect.any(String),
            })
        );
    });
});
describe('GET /api/v1/schedule/personal', () => {
    it('should get all scheduled events of one lecturer', async () => {
        const sampleId = "15389065-daf0-4a2e-bae5-2e3f024a7921";

        const response = await request(app)
            .get('/api/v1/schedule/personal?lecturerId=' + sampleId)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.length).toBeDefined()
        response.body.forEach(singleEvent => {
            expect(singleEvent).toEqual(
                expect.objectContaining({// prüft, dass Property existiert
                    start_time: expect.any(String),
                    end_time: expect.any(String),
                    title: expect.any(String),
                    room_id: expect.any(String),
                    course_id: expect.any(String),
                    lecturer_id: sampleId,
                })
            );
        });

    });
});
