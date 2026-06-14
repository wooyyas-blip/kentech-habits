"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "오늘" },
  { href: "/stats", label: "통계" },
  { href: "/about", label: "소개" },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="h-5 w-5 rounded-md"
            style={{
              background:
                "linear-gradient(135deg, var(--kentech) 0%, var(--kentech-deep) 100%)",
            }}
            aria-hidden
          />
          <span className="text-lg font-bold tracking-tight">켄텍 해비츠</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--ink)] text-white"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
