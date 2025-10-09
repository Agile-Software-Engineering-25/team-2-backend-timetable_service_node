const WORK_START = { h: 7, m: 0 };
const WORK_END   = { h: 22, m: 0 };

function parseIso(dt) {
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? null : d;
}

function inFuture(date) {
  return date.getTime() > Date.now();
}

function withinWorkWindow(start, end) {
  const toMin = d => d.getHours() * 60 + d.getMinutes();
  const s = toMin(start);
  const e = toMin(end);
  const ws = WORK_START.h * 60 + WORK_START.m;
  const we = WORK_END.h * 60 + WORK_END.m;
  return s >= ws && e <= we;
}

module.exports = { parseIso, inFuture, withinWorkWindow };
