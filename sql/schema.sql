-- Database Schema für Events Tabelle
-- Events Tabelle erstellen
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    time TEXT NOT NULL,
    end_time TEXT,
    title TEXT NOT NULL,
    room_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    study_group TEXT NOT NULL,
    lecturer TEXT,       -- Optional
    type TEXT CHECK (type IN ('Kurs', 'Dekansprechstunde', 'Klausureinsicht', 'Prüfung', 'E-Learning', 'Sonstiges')) DEFAULT 'Kurs',
    group_id TEXT,       -- Optional
    created_at TEXT NOT NULL DEFAULT (datetime('now'))

    );

-- Index für bessere Performance bei häufigen Abfragen
CREATE INDEX IF NOT EXISTS idx_events_time ON events(time);
CREATE INDEX IF NOT EXISTS idx_events_course_id ON events(course_id);
CREATE INDEX IF NOT EXISTS idx_events_room_id ON events(room_id);
CREATE INDEX IF NOT EXISTS idx_events_study_group ON events(study_group);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_lecturer ON events(lecturer);