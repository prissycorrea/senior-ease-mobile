/** Data local no formato YYYY-MM-DD (sem UTC). */
export function localISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Interpreta DD/MM ou DD/MM/AAAA; ano opcional usa defaultYear. */
export function parseBRDateToISO(
  input: string,
  defaultYear: number,
): string | null {
  const m = input.trim().match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);
  if (!m) return null;
  const dNum = parseInt(m[1], 10);
  const moNum = parseInt(m[2], 10);
  let y = m[3] ? parseInt(m[3], 10) : defaultYear;
  if (m[3] && y < 100) y += 2000;
  const dt = new Date(y, moNum - 1, dNum);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== moNum - 1 ||
    dt.getDate() !== dNum
  ) {
    return null;
  }
  return localISODate(dt);
}

const WEEK_SHORT_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] as const;

const WEEKDAY_TITLE_PT = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

const MONTHS_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

/** Ex.: "Segunda, 23 de março de 2026" */
export function formatAgendaLongDate(d: Date): string {
  const wd = WEEKDAY_TITLE_PT[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_PT[d.getMonth()];
  const year = d.getFullYear();
  return `${wd}, ${day} de ${month} de ${year}`;
}

export function parseISODateToLocal(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const d = parseInt(m[3], 10);
  const dt = new Date(y, mo, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

/** Rótulo curto tipo "Seg 23" */
export function dayPillLabel(d: Date): string {
  const w = WEEK_SHORT_PT[d.getDay()];
  return `${w} ${d.getDate()}`;
}

export type DayStripItem = {
  key: string;
  date: Date;
  /** Ex.: "Seg 23" — acessibilidade e leitores de tela. */
  label: string;
  weekShort: string;
  dayOfMonth: number;
};

/** Janela de dias para a faixa horizontal (centrada em `center`). */
export function buildDayStrip(center: Date, before = 7, after = 7): DayStripItem[] {
  const out: DayStripItem[] = [];
  for (let i = -before; i <= after; i++) {
    const date = addDays(center, i);
    const key = localISODate(date);
    out.push({
      key,
      date,
      label: dayPillLabel(date),
      weekShort: WEEK_SHORT_PT[date.getDay()],
      dayOfMonth: date.getDate(),
    });
  }
  return out;
}
