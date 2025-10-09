const { parseIso, inFuture, withinWorkWindow } = require('./timeWindow');
const { isHolidayHessen } = require('./holidays-hessen');

// Einheitlicher Fehleraufbau
const err = (code, message, hint) => ({ valid: false, error: { code, message, hint } });

async function validateScheduleInput(body) {
  // Feldnamen aus deinem Modell: time (Start), endTime (Ende)
  const start = parseIso(body.time);
  const end   = parseIso(body.endTime);

  if (!start || !end) {
    return err("INVALID_DATETIME", "Ungültiges Datum/Zeitformat.", "Beispiel: 2025-10-21T10:00:00");
  }
  if (!inFuture(start) || !inFuture(end)) {
    return err("PAST_DATE", "Datum/Uhrzeit liegt in der Vergangenheit.", "Bitte einen zukünftigen Zeitpunkt wählen.");
  }
  if (start >= end) {
    return err("TIME_ORDER", "Die Startzeit muss vor der Endzeit liegen.", "Endzeit nach vorne verschieben.");
  }
  if (!withinWorkWindow(start, end)) {
    return err("OUT_OF_BUSINESS_HOURS", "Zeiten müssen zwischen 07:00–22:00 Uhr liegen.", "Zeiten anpassen.");
  }
  if (isHolidayHessen(start)) {
    return err("HOLIDAY_BLOCKED", "In Hessen ist an diesem Tag ein Feiertag.", "Anderen Tag wählen.");
  }

  // Dozentenverfügbarkeit (Platzhalter – später echter Service):
  // if (body.lecturerId && !(await isLecturerAvailable(body.lecturerId, start, end))) {
  //   return err("LECTURER_UNAVAILABLE", "Dozent in diesem Zeitraum nicht verfügbar.", "Anderen Zeitraum wählen.");
  // }

  return { valid: true };
}

module.exports = { validateScheduleInput };
