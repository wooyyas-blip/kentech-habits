"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Habit,
  ColorKey,
  COLORS,
  loadHabits,
  saveHabits,
  makeId,
  todayKey,
} from "@/lib/habits";

const EMOJIS = ["☀️", "📚", "🏃", "💧", "🧘", "😴", "🥗", "✍️", "🎧", "🧹", "🏋️", "🌙"];

export default function NewHabitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState<ColorKey>("teal");
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("습관 이름을 입력해주세요.");
      return;
    }
    if (trimmed.length > 30) {
      setError("이름은 30자 이하로 입력해주세요.");
      return;
    }

    const habit: Habit = {
      id: makeId(),
      name: trimmed,
      emoji,
      color,
      createdAt: todayKey(),
      checkedDates: [],
    };
    const next = [...loadHabits(), habit];
    saveHabits(next);
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md">
      <button
        onClick={() => router.push("/")}
        className="mb-4 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
      >
        ← 오늘로
      </button>

      <h1
        className="text-2xl"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        새 습관 만들기
      </h1>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        지킬 수 있는 작은 단위로 정해보세요.
      </p>

      {/* 미리보기 */}
      <div
        className="mt-5 flex items-center gap-3 rounded-2xl border p-4"
        style={{ borderColor: "var(--line)", background: COLORS[color].soft }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl"
          style={{ borderColor: COLORS[color].ring, background: "var(--paper-raised)" }}
        >
          {emoji}
        </div>
        <span className="font-semibold">
          {name.trim() || "습관 이름"}
        </span>
      </div>

      {/* 이름 */}
      <div className="mt-6">
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          이름
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="예: 아침 6시 기상"
          maxLength={40}
          className="w-full rounded-xl border bg-[var(--paper-raised)] px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--ember)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      {/* 이모지 선택 */}
      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium">아이콘</span>
        <div className="grid grid-cols-6 gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              aria-label={`아이콘 ${e}`}
              aria-pressed={emoji === e}
              className="flex h-11 items-center justify-center rounded-xl border-2 text-lg transition-all"
              style={{
                borderColor: emoji === e ? COLORS[color].ring : "var(--line)",
                background: emoji === e ? COLORS[color].soft : "var(--paper-raised)",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* 색상 선택 */}
      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium">색상</span>
        <div className="flex flex-wrap gap-2.5">
          {(Object.keys(COLORS) as ColorKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setColor(k)}
              aria-label={`색상 ${COLORS[k].label}`}
              aria-pressed={color === k}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{
                background: COLORS[k].dot,
                outline: color === k ? `2px solid var(--ink)` : "none",
                outlineOffset: "2px",
              }}
            >
              {color === k && <span className="text-xs text-white">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-[var(--ember-deep)]">{error}</p>}

      <button
        onClick={handleSave}
        className="mt-7 w-full rounded-xl bg-[var(--ink)] py-3.5 text-[15px] font-medium text-[var(--paper)] transition-transform hover:scale-[1.01] active:scale-100"
      >
        습관 추가
      </button>
    </div>
  );
}
