CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    title TEXT NOT NULL,
    room_name TEXT NOT NULL,
    room_id TEXT NOT NULL,
    study_group TEXT NOT NULL,
    module_name TEXT NOT NULL,
    module_id TEXT NOT NULL,
    lecturer_id TEXT NOT NULL,
    lecturer_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('Kurs', 'Dekansprechstunde', 'Klausureinsicht', 'Prüfung', 'E-Learning', 'Sonstiges')) DEFAULT 'Kurs',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    comment TEXT
);

