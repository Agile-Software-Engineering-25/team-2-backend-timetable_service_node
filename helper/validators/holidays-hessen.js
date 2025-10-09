// Minimal: Hessen-Feiertage 2025; nicht vollständig
const HESSEN_2025 = new Set([
  "2025-01-01","2025-04-18","2025-04-21","2025-05-01",
  "2025-05-29","2025-06-09","2025-06-19","2025-10-03",
  "2025-12-25","2025-12-26"
]);

function isHolidayHessen(date) {
  const y = date.getFullYear();
  const iso = date.toISOString().slice(0,10);
  if (y === 2025) return HESSEN_2025.has(iso);
  return false; // default
}

module.exports = { isHolidayHessen };
