/**
 * Event Data Model
 * Zentrales Datenmodell für Veranstaltungen im Stundenplan-System
 */

/**
 * Enum für Veranstaltungstypen
 */
const EventType = {
  KURS: 'Kurs',
  DEKANSPRECHSTUNDE: 'Dekansprechstunde',
  KLAUSUREINSICHT: 'Klausureinsicht',
  PRUEFUNG: 'Prüfung',
  ELEARNING: 'E-Learning',
  SONSTIGES: 'Sonstiges'
};

/**
 * Event-Klasse für Veranstaltungen
 */
class Event {
  /**
   * @param {String} data.id  - Event-id
   * @param {Object} data - Event-Daten
   * @param {string|Date} data.time - Uhrzeit als String oder Date-Objekt
   * @param {string} data.title - Veranstaltungsname
   * @param {string} data.room_id - Raumreferenz (String-ID)
   * @param {string} data.room_name - Raumreferenz (String-ID)
   * @param {string} data.studyGroup - Studiengruppe
   * @param {string} data.lecturer_id - Dozent/Dozentin (optional)
   * @param {string} [data.lecturer_name] - Dozent/Dozentin (optional)
   * @param {string} data.type - Veranstaltungstyp aus EventType enum
   * @param {string} data.endTime - Endzeit (optional)
   * @param {string} [data.comment] - Endzeit (optional)
   */
  constructor(data) {
    // Pflichtfelder validieren
    this.validateRequired(data);

    // Pflichtfelder
    this.time = data.time;
    this.title = data.title;
    this.room_name = data.room_name;
    this.room_id = data.room_id;

    // Optionale Felder
    this.lecturer_id = data.lecturer_id || null;
    this.lecturer_name = data.lecturer_name || null;
    this.type = data.type || EventType.SONSTIGES;
    this.endTime = data.endTime || null;
    this.studyGroup = data.studyGroup || null;

    // Automatische Felder
    this.id = data.id || "";
    this.createdAt = data.createdAt || null;
  }

  /**
   * Validiert Pflichtfelder
   * @param {Object} data
   */
  validateRequired(data) {
    const required = ["time", "endTime", "title", "studyGroup", "lecturer_id", "lecturer_name", "room_id", "room_name", "type"];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw new Error(`Pflichtfelder fehlen: ${missing.join(', ')}`);
    }
  }





  /**
   * Konvertiert das Event zu einem Plain Object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      time: this.time,
      title: this.title,
      roomId: this.roomId,
      courseId: this.courseId,
      studyGroup: this.studyGroup,
      lecturer: this.lecturer,
      type: this.type,
      endTime: this.endTime,
      groupId: this.groupId,
      createdAt: this.createdAt
    };
  }

  /**
   * Erstellt Event aus Plain Object
   * @param {Object} obj
   * @returns {Event}
   */
  static fromJSON(obj) {
    return new Event(obj);
  }
}

/**
 * JSON Schema für Event-Validierung
 */
const EventSchema = {
  type: 'object',
  required: [["time", "endTime", "title", "studyGroup", "lecturer_id", "lecturer_name", "room_id", "room_name", "type"]],
  properties: {
    id: {
      type: 'string',
      description: 'Eindeutige Event-ID'
    },
    time: {
      type: 'string',
      description: 'Startzeit der Veranstaltung (ISO 8601 Format)',
      format: 'date-time'
    },
    title: {
      type: 'string',
      description: 'Name der Veranstaltung',
      minLength: 1
    },
    room_id: {
      type: 'string',
      description: 'Referenz zum Raum (externe Verwaltung)',
      minLength: 1
    },
    room_name: {
      type: 'string',
      description: 'Anzeigename des Raums',
      minLength: 1
    },
    studyGroup: {
      type: 'string',
      description: 'Studiengruppe',
      minLength: 1
    },
    lecturer_name: {
      type: ['string', 'null'],
      description: 'Dozent/Dozentin (optional)'
    },
    lecturer_id: {
      type: ['string', 'null'],
      description: 'Dozent/Dozentin (optional)'
    },
    type: {
      type: 'string',
      enum: Object.values(EventType),
      description: 'Typ der Veranstaltung'
    },
    endTime: {
      type: ['string', 'null'],
      description: 'Endzeit der Veranstaltung (ISO 8601 Format)',
      format: 'date-time'
    },
    createdAt: {
      type: 'string',
      description: 'Erstellungszeitpunkt',
      format: 'date-time'
    }
  },
  additionalProperties: false
};



module.exports = {
  Event,
};
