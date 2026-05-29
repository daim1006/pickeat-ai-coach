import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { inquireHistory } from "@/lib/n8n";

export const Route = createFileRoute("/history/")({
  component: History,
});

const tabs = ["오늘", "전체"] as const;
type Tab = (typeof tabs)[number];

const periods = ["전체 기간", "오늘", "최근 7일", "최근 30일", "직접 선택"] as const;
type Period = (typeof periods)[number];

// Anchor dates relative to "today" so the demo data stays meaningful.
const NOW = new Date();
const today = (h: number, m: number) => {
  const d = new Date(NOW);
  d.setHours(h, m, 0, 0);
  return d;
};
const daysAgo = (n: number, h: number, m: number) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d;
};

type Item = {
  id: string;
  name: string;
  brand: string;
  status: "ok" | "warn" | "bad";
  date: Date;
};

const data: Item[] = ([
  { id: "1", name: "제로콜라 500ml", brand: "코카콜라", status: "warn", date: today(13, 20) },
  { id: "2", name: "닭가슴살 샐러드", brand: "샐러디", status: "ok", date: today(12, 30) },
  { id: "3", name: "초코칩 쿠키", brand: "마켓오", status: "bad", date: today(10, 15) },
  { id: "4", name: "단백질 쉐이크", brand: "마이프로틴", status: "ok", date: daysAgo(1, 19, 40) },
  { id: "5", name: "라면", brand: "농심", status: "bad", date: daysAgo(1, 21, 10) },
  { id: "6", name: "그릭요거트", brand: "매일유업", status: "ok", date: daysAgo(3, 9, 0) },
  { id: "7", name: "아메리카노", brand: "스타벅스", status: "warn", date: daysAgo(10, 8, 30) },
  { id: "8", name: "삼각김밥 참치마요", brand: "GS25", status: "warn", date: daysAgo(25, 12, 0) },
  { id: "9", name: "초콜릿바", brand: "허쉬", status: "bad", date: daysAgo(40, 15, 45) },
] as Item[]).sort((a, b) => b.date.getTime() - a.date.getTime());

const badge: Record<string, { l: string; c: string }> = {
  ok: { l: "괜찮아요", c: "bg-success/15 text-success" },
  warn: { l: "조금만", c: "bg-warning/15 text-warning-foreground" },
  bad: { l: "패스", c: "bg-destructive/15 text-destructive" },
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(d: Date) {
  // Monday-based week
  const x = new Date(d);
  const day = x.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7;
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - diff);
  return x;
}

function weekLabel(start: Date) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const sow = startOfWeek(new Date());
  if (start.getTime() === sow.getTime()) return "이번주";
  const lastWeek = new Date(sow);
  lastWeek.setDate(lastWeek.getDate() - 7);
  if (start.getTime() === lastWeek.getTime()) return "지난주";
  const fmt = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

function timeLabel(d: Date) {
  const now = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (isSameDay(d, now)) return `오늘 ${hh}:${mm}`;
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (isSameDay(d, y)) return `어제 ${hh}:${mm}`;
  return `${d.getMonth() + 1}.${d.getDate()} ${hh}:${mm}`;
}

function History() {
  const [tab, setTab] = useState<Tab>("오늘");
  const [period, setPeriod] = useState<Period>("전체 기간");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [remote, setRemote] = useState<Item[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await inquireHistory<unknown>({});
        const arr = Array.isArray(res)
          ? res
          : Array.isArray((res as { items?: unknown })?.items)
            ? ((res as { items: unknown[] }).items)
            : [];
        const items: Item[] = arr
          .map((r, i) => {
            const o = (r ?? {}) as Record<string, unknown>;
            const rawDate = o.date ?? o.createdAt ?? o.timestamp;
            const d = rawDate ? new Date(rawDate as string) : new Date();
            if (isNaN(d.getTime())) return null;
            const status = (o.status as Item["status"]) ?? "ok";
            return {
              id: String(o.id ?? `r-${i}`),
              name: String(o.name ?? "기록"),
              brand: String(o.brand ?? ""),
              status,
              date: d,
            } satisfies Item;
          })
          .filter((x): x is Item => x !== null);
        if (!cancelled) setRemote(items);
      } catch {
        // ignore network errors, keep demo data
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    let list = [...data, ...remote].sort((a, b) => b.date.getTime() - a.date.getTime());

    if (tab === "오늘") {
      list = list.filter((d) => isSameDay(d.date, now));
    }

    if (period === "오늘") {
      list = list.filter((d) => isSameDay(d.date, now));
    } else if (period === "최근 7일") {
      const c = new Date(now);
      c.setDate(c.getDate() - 7);
      list = list.filter((d) => d.date >= c);
    } else if (period === "최근 30일") {
      const c = new Date(now);
      c.setDate(c.getDate() - 30);
      list = list.filter((d) => d.date >= c);
    } else if (period === "직접 선택") {
      if (from) {
        const f = new Date(from);
        f.setHours(0, 0, 0, 0);
        list = list.filter((d) => d.date >= f);
      }
      if (to) {
        const t = new Date(to);
        t.setHours(23, 59, 59, 999);
        list = list.filter((d) => d.date <= t);
      }
    }

    return list;
  }, [tab, period, from, to, remote]);

  const grouped = useMemo(() => {
    if (tab !== "전체") return null;
    const map = new Map<number, Item[]>();
    for (const it of filtered) {
      const k = startOfWeek(it.date).getTime();
      const arr = map.get(k) ?? [];
      arr.push(it);
      map.set(k, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([k, items]) => ({ start: new Date(k), items }));
  }, [tab, filtered]);

  return (
    <AppShell withBottomNav>
      <header className="px-5 pt-5">
        <h1 className="text-[22px] font-extrabold tracking-tight">기록</h1>
        <p className="text-[13px] text-muted-foreground mt-1">스캔한 음식과 분석을 한눈에 봐요</p>

        <div className="mt-4 inline-flex p-1 bg-muted rounded-full">
          {tabs.map((x) => (
            <button
              key={x}
              onClick={() => setTab(x)}
              className={cn(
                "px-4 h-9 rounded-full text-[13px] font-medium transition-all",
                tab === x ? "bg-surface text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"
              )}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 h-8 rounded-full text-[12px] font-medium border transition-all",
                period === p
                  ? "bg-primary/10 text-primary border-primary"
                  : "bg-surface text-muted-foreground border-border"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {period === "직접 선택" && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 px-2 rounded-xl border border-border bg-surface text-[12px]"
            />
            <span className="text-[12px] text-muted-foreground">~</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 px-2 rounded-xl border border-border bg-surface text-[12px]"
            />
          </div>
        )}
      </header>

      <ul className="px-5 mt-4 space-y-2 pb-6">
        {filtered.map((d) => (
          <Row key={d.id} d={d} />
        ))}
        {filtered.length === 0 && <EmptyState />}
      </ul>
      <BottomNav />
    </AppShell>
  );
}

function Row({ d }: { d: Item }) {
  const b = badge[d.status];
  const isProteinShake = d.id === "4";
  const linkProps = isProteinShake
    ? ({ to: "/history/protein-shake" } as const)
    : ({ to: "/history/$id", params: { id: d.id } } as const);
  return (
    <li>
      <Link
        {...linkProps}
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border active:bg-muted/40"
      >
        <div className="size-14 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[14.5px] font-semibold truncate">{d.name}</div>
          <div className="text-[12px] text-muted-foreground">{d.brand}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{timeLabel(d.date)}</div>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${b.c}`}>{b.l}</span>
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <li className="text-center text-[13px] text-muted-foreground py-10 list-none">
      해당 기간의 기록이 없어요
    </li>
  );
}
