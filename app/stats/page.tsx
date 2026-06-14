"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Habit,
  loadHabits,
  computeStats,
  currentStreak,
  weeklyCount,
  COLORS,
} from "@/lib/habits";

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
    setReady(true);
  }, []);

  const stats = computeStats(habits);

  if (ready && habits.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-[var(--line)] px-6 py-16 text-center">
        <p className="text-base font-semibold">보여줄 데이터가 아직 없어요</p>
        <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
          습관을 만들고 며칠 체크하면 통계가 쌓여요.
        </p>
        <Link
          href="/habits/new"
          className="mt-5 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--kentech)" }}
        >
          습관 만들기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        통계
      </h1>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">최근 흐름을 한눈에.</p>

      {/* 요약 카드 4개 */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatCard label="등록한 습관" value={stats.totalHabits} suffix="개" />
        <StatCard label="오늘 완료율" value={stats.todayRate} suffix="%" accent />
        <StatCard label="최장 streak" value={stats.longestActiveStreak} suffix="일" flame />
        <StatCard label="이번 주 채움률" value={stats.overallRate} suffix="%" />
      </div>

      {/* 습관별 요약 */}
      <h2 className="mb-3 mt-8 text-sm font-semibold text-[var(--ink-soft)]">
        습관별 현황
      </h2>
      <div className="space-y-2">
        {!ready
          ? null
          : habits.map((h) => {
              const c = COLORS[h.color];
              const streak = currentStreak(h);
              const week = weeklyCount(h);
              return (
                <div
                  key={h.id}
                  className="flex items-center gap-3 rounded-xl border bg-[var(--paper-raised)] px-4 py-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
                    style={{ background: c.soft }}
                  >
                    {h.emoji}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">{h.name}</span>
                  <div className="flex items-center gap-4 text-xs text-[var(--ink-soft)]">
                    <span>
                      이번 주{" "}
                      <span className="font-mono text-[var(--ink)]">{week}/7</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-mono text-[var(--ember-deep)]">{streak}</span>
                      <span aria-hidden>🔥</span>
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
  flame,
}: {
  label: string;
  value: number;
  suffix: string;
  accent?: boolean;
  flame?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: "var(--line)",
        background: accent ? "var(--kentech)" : "var(--paper-raised)",
      }}
    >
      <p
        className="text-xs"
        style={{ color: accent ? "rgba(255,255,255,0.85)" : "var(--ink-soft)" }}
      >
        {label}
      </p>
      <p
        className="mt-1.5 font-mono text-3xl tabular-nums"
        style={{ color: accent ? "#fff" : "var(--ink)" }}
      >
        {value}
        <span className="ml-0.5 text-base font-normal">{suffix}</span>
        {flame && value > 0 && <span className="ml-1 text-xl" aria-hidden>🔥</span>}
      </p>
    </div>
  );
}
