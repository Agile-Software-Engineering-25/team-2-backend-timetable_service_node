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
   * @param {string} data.module - Veranstaltungsname
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
    this.module = data.module
    // Optionale Felder
    this.lecturer_id = data.lecturer_id || null;
    this.lecturer_name = data.lecturer_name || null;
    this.type = data.type || EventType.SONSTIGES;
    this.endTime = data.endTime || null;
    this.studyGroup = data.studyGroup || null;
    this.comment = data.comment || null;
    // Automatische Felder
    this.id = data.id || "";
    this.createdAt = data.createdAt || null;
  }

  /**
   * Validiert Pflichtfelder
   * @param {Object} data
   */
  validateRequired(data) {
    const required = ["time", "endTime", "title", "studyGroup", "lecturer_id", "lecturer_name", "room_id", "room_name", "type", "module"];
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
      endTime:this.endTime,
      comment:this.comment,
      lecturer_id:this.lecturer_id,      
      lecturer_name:this.lecturer_name,    
      module:this.module,      
      room_id:this.room_id,      
      room_name:this.room_name,            
      studyGroup:this.studyGroup,      
      time:this.time,     
      title:this.title,      
      type:this.type,
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

module.exports = {
  Event,
};
