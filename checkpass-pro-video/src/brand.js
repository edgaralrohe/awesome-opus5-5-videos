// Paleta "Luxe Champagne & Royal Violet" (modo oscuro).
export const PALETTE = {
  bg: '#0D0E15', card: '#161922', border: '#262B3A',
  violet: '#7C3AED', ctaFrom: '#7928CA', ctaTo: '#581C87',
  champagneTitle: '#F1E3B8', champagneIcon: '#E8D5A3', champagneMuted: '#C8B78A',
  text: '#FFFFFF', text2: '#94A3B8', text3: '#64748B',
};
// Solo para estados: check-in, pendiente, alerta. Nunca decorativos.
export const STATUS = { ok: '#22C55E', pending: '#F59E0B', alert: '#EF4444' };

export const isStatusColor = c => Object.values(STATUS).includes(c.toUpperCase());

/** Todos los textos que pueden aparecer en pantalla según la config. */
export function visibleTexts(cfg) {
  const c = cfg.copy;
  const out = [...c.hook, c.tagline, ...c.scan, ...c.invite, ...c.tables, ...c.live,
    ...c.segments, c.ctaMain, c.ctaSub, ...cfg.segments, cfg.event,
    ...cfg.guests.map(g => `${g.name} Mesa ${g.table}`)];
  if (cfg.showPricing) out.push(c.ctaPricing);
  return out;
}
