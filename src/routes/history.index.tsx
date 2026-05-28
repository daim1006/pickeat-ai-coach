import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history/")({
  component: History,
});

const filters = ["오늘", "이번주", "전체"] as const;
type Filter = (typeof filters)[number];

const data = [
  { id: "1", name: "제로콜라 500ml", brand: "코카콜라", status: "warn", time: "오늘 13:20" },
  { id: "2", name: "닭가슴살 샐러드", brand: "샐러디", status: "ok", time: "오늘 12:30" },
  { id: "3", name: "초코칩 쿠키", brand: "마켓오", status: "bad", time: "오늘 10:15" },
  { id: "4", name: "단백질 쉐이크", brand: "마이프로틴", status: "ok", time: "어제 19:40" },
  { id: "5", name: "라면", brand: "농심", status: "bad", time: "어제 21:10" },
];

const badge: Record<string, { l: string; c: string }> = {
  ok: { l: "괜찮아요", c: "bg-success/15 text-success" },
  warn: { l: "조금만", c: "bg-warning/15 text-warning-foreground" },
  bad: { l: "패스", c: "bg-destructive/15 text-destructive" },
};

function History() {
  const [f, setF] = useState<Filter>("오늘");
  return (
    <AppShell withBottomNav>
      <header className="px-5 pt-5">
        <h1 className="text-[22px] font-extrabold tracking-tight">기록</h1>
        <p className="text-[13px] text-muted-foreground mt-1">스캔한 음식과 분석을 한눈에 봐요</p>

        <div className="mt-4 inline-flex p-1 bg-muted rounded-full">
          {filters.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={cn(
                "px-4 h-9 rounded-full text-[13px] font-medium transition-all",
                f === x ? "bg-surface text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"
              )}
            >
              {x}
            </button>
          ))}
        </div>
      </header>

      <ul className="px-5 mt-4 space-y-2 pb-6">
        {data.map((d) => {
          const b = badge[d.status];
          return (
            <li key={d.id}>
              <Link
                to="/history/$id"
                params={{ id: d.id }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border active:bg-muted/40"
              >
                <div className="size-14 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-semibold truncate">{d.name}</div>
                  <div className="text-[12px] text-muted-foreground">{d.brand}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{d.time}</div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${b.c}`}>{b.l}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <BottomNav />
    </AppShell>
  );
}
