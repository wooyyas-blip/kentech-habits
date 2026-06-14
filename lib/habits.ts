// 데이터 모델 + localStorage 입출력 + streak/진행률 계산
// 백엔드 없이 브라우저에만 저장한다. 서버 컴포넌트에서 import하지 말 것.

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: ColorKey;
  createdAt: string; // ISO date
  // 완료한 날짜들을 'YYYY-MM-DD' 문자열 Set처럼 배열로 보관
  checkedDates: string[];
};

export type ColorKey = "teal" | "sky" | "moss" | "grape" | "coral" | "amber";

export const COLORS: Record<ColorKey, { label: string; dot: string; soft: string; ring: string }> = {
  teal:  { label: "Teal",  dot: "#00A6B6", soft: "#DCF1F3", ring: "#00A6B6" },
  sky:   { label: "Sky",   dot: "#2E7DB0", soft: "#DCEBF5", ring: "#2E7DB0" },
  moss:  { label: "Moss",  dot: "#5B8C3E", soft: "#E2EED8", ring: "#5B8C3E" },
  grape: { label: "Grape", dot: "#7A5AA8", soft: "#E8E1F2", ring: "#7A5AA8" },
  coral: { label: "Coral", dot: "#E26D5C", soft: "#F8E2DE", ring: "#E26D5C" },
  amber: { label: "Amber", dot: "#C8941A", soft: "#F5E9CC", ring: "#C8941A" },
};

const STORAGE_KEY = "kentech-habits:v1";

// ---- 날짜 유틸 (로컬 타임존 기준 YYYY-MM-DD) --------------------------------
export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

// ---- localStorage 입출력 ---------------------------------------------------
export function loadHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Habit[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---- streak 계산 -----------------------------------------------------------
// 오늘(또는 어제)부터 거꾸로 연속으로 체크된 날 수.
// 오늘 아직 체크 안 했어도 어제까지 이어졌으면 streak는 유지된다.
export function currentStreak(habit: Habit, today = new Date()): number {
  const checked = new Set(habit.checkedDates);
  let streak = 0;

  // 시작점: 오늘 체크돼 있으면 오늘부터, 아니면 어제부터 센다
  let cursor = checked.has(toKey(today)) ? today : addDays(today, -1);

  while (checked.has(toKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function isCheckedToday(habit: Habit, today = new Date()): boolean {
  return habit.checkedDates.includes(toKey(today));
}

// ---- 주간 진행률 (이번 주 월~일) ------------------------------------------
export type WeekCell = { key: string; label: string; checked: boolean; isToday: boolean };

export function weekCells(habit: Habit, today = new Date()): WeekCell[] {
  // 월요일 시작 주
  const dow = (today.getDay() + 6) % 7; // 월=0 ... 일=6
  const monday = addDays(today, -dow);
  const checked = new Set(habit.checkedDates);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const tKey = toKey(today);

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const key = toKey(d);
    return {
      key,
      label: labels[i],
      checked: checked.has(key),
      isToday: key === tKey,
    };
  });
}

export function weeklyCount(habit: Habit, today = new Date()): number {
  return weekCells(habit, today).filter((c) => c.checked).length;
}

// ---- 전체 통계 -------------------------------------------------------------
export type Stats = {
  totalHabits: number;
  doneToday: number;
  todayRate: number; // 0..100
  longestActiveStreak: number;
  overallRate: number; // 최근 7일간 (완료칸/전체칸) %
};

export function computeStats(habits: Habit[], today = new Date()): Stats {
  const total = habits.length;
  if (total === 0) {
    return { totalHabits: 0, doneToday: 0, todayRate: 0, longestActiveStreak: 0, overallRate: 0 };
  }
  const doneToday = habits.filter((h) => isCheckedToday(h, today)).length;
  const longest = Math.max(...habits.map((h) => currentStreak(h, today)));

  // 최근 7일 전체 채움률
  let filled = 0;
  let cells = 0;
  for (const h of habits) {
    const w = weekCells(h, today);
    cells += w.length;
    filled += w.filter((c) => c.checked).length;
  }

  return {
    totalHabits: total,
    doneToday,
    todayRate: Math.round((doneToday / total) * 100),
    longestActiveStreak: longest,
    overallRate: cells === 0 ? 0 : Math.round((filled / cells) * 100),
  };
}

// ---- 격려 메시지 -----------------------------------------------------------
export function streakMessage(streak: number): string | null {
  if (streak >= 30) return "30일 돌파! 이제 완전히 일상이 됐어요";
  if (streak >= 21) return "21일째 — 습관이 자리잡는 구간이에요";
  if (streak >= 14) return "2주 연속, 흐름을 제대로 탔어요";
  if (streak >= 7) return "일주일 연속 달성!";
  if (streak >= 3) return "3일 연속, 작심삼일은 넘겼어요";
  return null;
}
