"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Habit,
  loadHabits,
  saveHabits,
  todayKey,
  computeStats,
} from "@/lib/habits";
import HabitCard from "@/components/HabitCard";

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
    setReady(true);
  }, []);

  const persist = (next: Habit[]) => {
    setHabits(next);
    saveHabits(next);
  };

  const toggle = (id: string) => {
    const key = todayKey();
    persist(
      habits.map((h) => {
        if (h.id !== id) return h;
        const has = h.checkedDates.includes(key);
        return {
          ...h,
          checkedDates: has
            ? h.checkedDates.filter((d) => d !== key)
            : [...h.checkedDates, key],
        };
      })
    );
  };

  const remove = (id: string) => persist(habits.filter((h) => h.id !== id));

  const stats = computeStats(habits);
  const today = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div>
      {/* 히어로 */}
      <section className="mb-7">
        <p className="text-sm text-[var(--ink-soft)]">{today}</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight">
          오늘 하루, 한 칸씩
        </h1>

        {ready && habits.length > 0 && (
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-[var(--ink-soft)]">
              오늘{" "}
              <span className="font-mono font-semibold text-[var(--ink)]">
                {stats.doneToday}/{stats.totalHabits}
              </span>
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.todayRate}%`, background: "var(--kentech)" }}
              />
            </div>
            <span className="font-mono text-xs text-[var(--ink-soft)]">
              {stats.todayRate}%
            </span>
          </div>
        )}
      </section>

      {/* 습관 목록 */}
      {!ready ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)]"
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onToggle={toggle} onDelete={remove} />
          ))}
        </div>
      )}

      {ready && habits.length > 0 && (
        <Link
          href="/habits/new"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--line)] py-4 text-sm font-medium text-[var(--ink-soft)] transition-colors hover:border-[var(--kentech)] hover:text-[var(--kentech-deep)]"
        >
          <span className="text-lg leading-none">+</span> 새 습관 추가
        </Link>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--line)] px-6 py-16 text-center">
      <p className="text-base font-semibold">아직 습관이 없어요</p>
      <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
        작게 시작해요. 매일 한 칸씩 체크하면 흐름이 보여요.
      </p>
      <Link
        href="/habits/new"
        className="mt-5 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        style={{ background: "var(--kentech)" }}
      >
        첫 습관 만들기
      </Link>
    </div>
  );
}
