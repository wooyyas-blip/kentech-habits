import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">켄텍 해비츠 소개</h1>

      <p className="mt-4 leading-relaxed text-[var(--ink)]">
        켄텍 학생을 위한 가벼운 습관 트래커예요. 매일 한 칸씩 체크하면 streak와 주간 진행률이
        쌓이는 걸 눈으로 확인할 수 있어요.
      </p>

      <div className="mt-6 space-y-4">
        <Step n="1" title="습관을 추가해요" body="이름·아이콘·색상만 정하면 끝." />
        <Step n="2" title="매일 체크해요" body="오늘 했으면 버튼 하나. 연속으로 채우면 streak가 올라가요." />
        <Step n="3" title="흐름을 확인해요" body="주간 진행률과 통계로 루틴이 단단해지는 걸 살펴봐요." />
      </div>

      <div
        className="mt-7 rounded-2xl border p-5"
        style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}
      >
        <h2 className="text-sm font-semibold">왜 만들었나요</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          목표는 세우기 쉽지만 지키고 있는지 알기 어려워요. 기록이 보이지 않으면 금방 동기가
          식죠. 켄텍 해비츠는 추가하고, 체크하고, 흐름을 보는 것만 합니다. 데이터는 브라우저에만
          저장돼요.
        </p>
      </div>

      <Link
        href="/habits/new"
        className="mt-7 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        style={{ background: "var(--kentech)" }}
      >
        지금 시작하기
      </Link>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-3.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold text-white"
        style={{ background: "var(--kentech)" }}
      >
        {n}
      </span>
      <div>
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--ink-soft)]">{body}</p>
      </div>
    </div>
  );
}
