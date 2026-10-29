// Tiempo musical → segundos. Las tarjetas se definen en pulsos para cortar al ritmo.
export function buildSchedule(cards, bpm, offset = 0) {
  const spb = 60 / bpm;
  let beat = 0;
  return cards.map((c, index) => {
    const start = offset + beat * spb;
    beat += c.beats;
    return { ...c, index, start, end: offset + beat * spb };
  });
}

export function cardAt(schedule, t) {
  for (const c of schedule) if (t < c.end) return c;
  return schedule.at(-1);
}

export function beatPhase(t, bpm, offset = 0) {
  const b = ((t - offset) * bpm) / 60;
  return ((b % 1) + 1) % 1;
}
