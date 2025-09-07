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
  SONSTIGES: 'Sonstiges'
};

/**
 * Event-Klasse für Veranstaltungen
 */
class Event {
  /**
   * @param {Object} data - Event-Daten
   * @param {string|Date} data.time - Uhrzeit als String oder Date-Objekt
   * @param {string} data.title - Veranstaltungsname
   * @param {string} data.roomId - Raumreferenz (String-ID)
   * @param {string} data.courseId - Veranstaltungsnummer
   * @param {string} data.studyGroup - Studiengruppe
   * @param {string} [data.lecturer] - Dozent/Dozentin (optional)
   * @param {string} [data.type] - Veranstaltungstyp aus EventType enum
   * @param {string} [data.endTime] - Endzeit (optional)
   * @param {string} [data.groupId] - Gruppen-ID (optional)
   */
  constructor(data) {
    // Pflichtfelder validieren
    this.validateRequired(data);

    // Pflichtfelder
    this.time = data.time;
    this.title = data.title;
    this.roomId = data.roomId;
    this.courseId = data.courseId;
    this.studyGroup = data.studyGroup;

    // Optionale Felder
    this.lecturer = data.lecturer || null;
    this.type = data.type || EventType.SONSTIGES;
    this.endTime = data.endTime || null;
    this.groupId = data.groupId || null;

    // Automatische Felder
    this.id = data.id || this.generateId();
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  /**
   * Validiert Pflichtfelder
   * @param {Object} data
   */
  validateRequired(data) {
    const required = ['time', 'title', 'roomId', 'courseId', 'studyGroup'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw new Error(`Pflichtfelder fehlen: ${missing.join(', ')}`);
    }
  }

  /**
   * Generiert eine eindeutige ID
   * @returns {string}
   */
  generateId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Konvertiert die Zeit in ein Date-Objekt
   * @returns {Date}
   */
  getTimeAsDate() {
    if (this.time instanceof Date) {
      return this.time;
    }
    return new Date(this.time);
  }

  /**
   * Konvertiert die Endzeit in ein Date-Objekt
   * @returns {Date|null}
   */
  getEndTimeAsDate() {
    if (!this.endTime) return null;
    if (this.endTime instanceof Date) {
      return this.endTime;
    }
    return new Date(this.endTime);
  }

  /**
   * Prüft ob die Veranstaltung zu einem bestimmten Zeitpunkt stattfindet
   * @param {string|Date} checkTime
   * @returns {boolean}
   */
  isAtTime(checkTime) {
    const eventTime = this.getTimeAsDate();
    const check = checkTime instanceof Date ? checkTime : new Date(checkTime);
    return eventTime.getTime() === check.getTime();
  }

  /**
   * Prüft ob die Veranstaltung in einem Zeitraum stattfindet
   * @param {string|Date} startTime
   * @param {string|Date} endTime
   * @returns {boolean}
   */
  isInTimeRange(startTime, endTime) {
    const eventTime = this.getTimeAsDate();
    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);

    return eventTime >= start && eventTime <= end;
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

  /**
   * Filtert Events nach verschiedenen Kriterien
   * @param {Event[]} events - Array von Events
   * @param {Object} filters - Filter-Objekt
   * @returns {Event[]}
   */
  static filter(events, filters) {
    return events.filter(event => {
      // Filter nach Typ
      if (filters.type && event.type !== filters.type) {
        return false;
      }

      // Filter nach Kurs-ID
      if (filters.courseId && event.courseId !== filters.courseId) {
        return false;
      }

      // Filter nach Raum-ID
      if (filters.roomId && event.roomId !== filters.roomId) {
        return false;
      }

      // Filter nach Studiengruppe
      if (filters.studyGroup && event.studyGroup !== filters.studyGroup) {
        return false;
      }

      // Filter nach Dozent
      if (filters.lecturer && event.lecturer !== filters.lecturer) {
        return false;
      }

      // Filter nach Zeitraum
      if (filters.startTime && filters.endTime) {
        if (!event.isInTimeRange(filters.startTime, filters.endTime)) {
          return false;
        }
      }

      return true;
    });
  }
}

/**
 * JSON Schema für Event-Validierung
 */
const EventSchema = {
  type: 'object',
  required: ['time', 'title', 'roomId', 'courseId', 'studyGroup'],
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
    roomId: {
      type: 'string',
      description: 'Referenz zum Raum (externe Verwaltung)',
      minLength: 1
    },
    courseId: {
      type: 'string',
      description: 'Veranstaltungsnummer',
      minLength: 1
    },
    studyGroup: {
      type: 'string',
      description: 'Studiengruppe',
      minLength: 1
    },
    lecturer: {
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
    groupId: {
      type: ['string', 'null'],
      description: 'Gruppen-ID (optional)'
    },
    createdAt: {
      type: 'string',
      description: 'Erstellungszeitpunkt',
      format: 'date-time'
    }
  },
  additionalProperties: false
};

/**
 * Utility-Funktionen für Event-Manipulation
 */
const EventUtils = {
  /**
   * Gruppiert Events nach Datum
   * @param {Event[]} events
   * @returns {Object}
   */
  groupByDate(events) {
    return events.reduce((groups, event) => {
      const date = event.getTimeAsDate().toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {});
  },

  /**
   * Sortiert Events nach Zeit
   * @param {Event[]} events
   * @returns {Event[]}
   */
  sortByTime(events) {
    return [...events].sort((a, b) => {
      return a.getTimeAsDate().getTime() - b.getTimeAsDate().getTime();
    });
  },

  /**
   * Findet Konflikte zwischen Events (gleiche Zeit, Raum oder Dozent)
   * @param {Event[]} events
   * @returns {Object}
   */
  findConflicts(events) {
    const conflicts = {
      timeRoom: [], // Gleicher Raum zur gleichen Zeit
      timeLecturer: [] // Gleicher Dozent zur gleichen Zeit
    };

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];

        if (event1.isAtTime(event2.time)) {
          // Raumkonflikt
          if (event1.roomId === event2.roomId) {
            conflicts.timeRoom.push([event1, event2]);
          }

          // Dozentenkonflikt
          if (event1.lecturer && event2.lecturer &&
              event1.lecturer === event2.lecturer) {
            conflicts.timeLecturer.push([event1, event2]);
          }
        }
      }
    }

    return conflicts;
  }
};

module.exports = {
  Event,
  EventType,
  EventSchema,
  EventUtils
};
