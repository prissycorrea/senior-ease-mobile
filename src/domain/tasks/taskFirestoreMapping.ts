import { addDays, localISODate, parseISODateToLocal } from "../../presentation/utils/agendaDates";
import type { HomeActivity } from "../../presentation/types/homeActivity";

/** Mesmo contrato da web: `VERSAO WEB/.../dashboard-novo.entity.ts` */
export type FirestoreTaskFields = {
  task: string;
  period: string;
  completed: boolean;
  createdAt: unknown;
};

export function firestoreTaskToHomeActivity(
  id: string,
  data: FirestoreTaskFields,
): HomeActivity {
  const periodIso =
    typeof data.period === "string" ? data.period : new Date().toISOString();
  const d = new Date(periodIso);
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  const scheduleDate = localISODate(safe);
  return {
    id,
    title: data.task,
    subtitle: formatSubtitleFromPeriod(safe),
    done: data.completed,
    scheduleDate,
    periodIso,
  };
}

function formatSubtitleFromPeriod(d: Date): string {
  const now = new Date();
  const todayKey = localISODate(now);
  const tomorrowKey = localISODate(addDays(now, 1));
  const dayKey = localISODate(d);
  let dayLabel: string;
  if (dayKey === todayKey) dayLabel = "Hoje";
  else if (dayKey === tomorrowKey) dayLabel = "Amanhã";
  else {
    const parsed = parseISODateToLocal(dayKey);
    dayLabel = parsed
      ? `${String(parsed.getDate()).padStart(2, "0")}/${String(parsed.getMonth() + 1).padStart(2, "0")}`
      : dayKey;
  }
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dayLabel} — ${hh}:${mm}h`;
}

/**
 * Atualiza o horário em `period` mantendo o dia de `scheduleDate` (YYYY-MM-DD local).
 */
export function mergeTitleAndSubtitleIntoFirestore(
  previous: HomeActivity,
  title: string,
  subtitle: string,
): { task: string; period: string } {
  const baseDate = parseISODateToLocal(previous.scheduleDate) ?? new Date();
  const timeFromSubtitle = extractTimeFromSubtitle(subtitle);
  const next = new Date(baseDate);
  if (timeFromSubtitle) {
    next.setHours(timeFromSubtitle.h, timeFromSubtitle.m, 0, 0);
  } else if (previous.periodIso) {
    const prev = new Date(previous.periodIso);
    if (!Number.isNaN(prev.getTime())) {
      next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
    }
  }
  return {
    task: title.trim(),
    period: next.toISOString(),
  };
}

function extractTimeFromSubtitle(
  subtitle: string,
): { h: number; m: number } | null {
  const s = subtitle.replace(/—/g, "-");
  const match = s.match(/(\d{1,2})\s*[:h]\s*(\d{2})/i);
  if (!match) return null;
  const h = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const m = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return { h, m };
}
