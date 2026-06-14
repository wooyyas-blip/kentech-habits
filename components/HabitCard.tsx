"use client";

import {
  Habit,
  COLORS,
  currentStreak,
  isCheckedToday,
  weekCells,
  weeklyCount,
  streakMessage,
} from "@/lib/habits";
import { useState } from "react";

type Props = {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({ habit, onToggle, onDelete }: Props) {
  const c = COLORS[habit.color];
  const streak = currentStreak(habit);
  const checked = isCheckedToday(habit);
  const week = weekCells(habit);
  const weekN = weeklyCount(habit);
  const [justChecked, setJustChecked] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const msg = streakMessage(streak);

  const handleToggle = () => {
    if (!checked) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 340);
    }
    onToggle(habit.id);
  };

  return (
    <article
      className="rounded-2xl border bg-[var(--paper-raised)] p-4 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-start gap-3">
        {/* 큰 체크 버튼 */}
        <button
          onClick={handleToggle}
          aria-pressed={checked}
          aria-label={checked ? `${habit.name} 오늘 완료 취소` : `${habit.name} 오늘 완료`}
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl transition-all ${
            justChecked ? "animate-pop" : ""
          }`}
          style={{
            borderColor: checked ? c.ring : "var(--line)",
            background: checked ? c.soft : "transparent",
          }}
        >
          <span style={{ opacity: checked ? 1 : 0.45 }}>{habit.emoji}</span>
          {checked && (
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white"
              style={{ background: c.dot }}
              aria-hidden
            >
              ✓
            </span>
          )}
        </button>

        {/* 이름 + streak */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold">{habit.name}</h3>
            <div className="flex items-center gap-1">
              <span
                className="font-mono text-sm font-semibold tabular-nums"
                style={{ color: streak > 0 ? "var(--ember-deep)" : "var(--ink-soft)" }}
              >
                {streak}
              </span>
              <span className={streak > 0 ? "" : "opacity-25 grayscale"} aria-hidden>
                🔥
              </span>
            </div>
          </div>

          {/* streak 체인 — 이번 주 7칸 */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {week.map((cell) => (
              <div key={cell.key} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="h-7 w-full rounded-md border transition-colors"
                  style={{
                    background: cell.checked ? c.dot : "transparent",
                    borderColor: cell.checked
                      ? c.dot
                      : cell.isToday
                      ? c.ring
                      : "var(--line)",
                    borderStyle: cell.isToday && !cell.checked ? "dashed" : "solid",
                  }}
                  title={cell.key}
                />
                <span
                  className="text-[10px]"
                  style={{ color: cell.isToday ? "var(--ink)" : "var(--ink-soft)" }}
                >
                  {cell.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-[var(--ink-soft)]">이번 주 {weekN}/7</span>
            {confirming ? (
              <span className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => onDelete(habit.id)}
                  className="font-medium text-[var(--ember-deep)] hover:underline"
                >
                  삭제 확인
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-[var(--ink-soft)] hover:underline"
                >
                  취소
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="text-xs text-[var(--ink-soft)] hover:text-[var(--ember-deep)]"
              >
                삭제
              </button>
            )}
          </div>

          {msg && (
            <p
              className="mt-2 rounded-lg px-2.5 py-1.5 text-xs"
              style={{ background: c.soft, color: "var(--ink)" }}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
