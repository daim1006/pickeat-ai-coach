import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { Mascot } from "@/components/Mascot";
import { Bell, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/home")({
  component: Home,
});

type NumericFocus = { kind: "numeric"; label: string; value: number; max: number; unit: string };
type DetectFocus = { kind: "detect"; label: string; detected: boolean };
type FocusItem = NumericFocus | DetectFocus;

const NUMERIC_DEFAULTS: Record<string, { max: number; unit: string; current: number }> = {
  당류: { max: 70, unit: "g", current: 28 },
  나트륨: { max: 1500, unit: "mg", current: 1200 },
  포화지방: { max: 10, unit: "g", current: 8 },
  카페인: { max: 300, unit: "mg", current: 34 },
  단백질: { max: 70, unit: "g", current: 45 },
};

const DETECT_KEYS = new Set(["대체당", "첨가물"]);

const DEFAULT_FOCUS: FocusItem[] = [
  { kind: "numeric", label: "당류", value: 28, max: 70, unit: "g" },
  { kind: "numeric", label: "나트륨", value: 1200, max: 1500, unit: "mg" },
  { kind: "numeric", label: "포화지방", value: 8, max: 10, unit: "g" },
];


const eaten = [
  { name: "제로콜라 500ml", brand: "코카콜라", status: "ok", time: "13:20" },
  { name: "닭가슴살 샐러드", brand: "샐러디", status: "ok", time: "12:30" },
  { name: "초코칩 쿠키", brand: "마켓오", status: "warn", time: "10:15" },
];

const badge: Record<string, { label: string; cls: string }> = {
  ok: { label: "괜찮아요", cls: "bg-success/15 text-success" },
  warn: { label: "조금만", cls: "bg-warning/15 text-warning-foreground" },
  bad: { label: "패스", cls: "bg-destructive/15 text-destructive" },
};

function Home() {
  const [focus, setFocus] = useState<FocusItem[]>(DEFAULT_FOCUS);
  const [chips, setChips] = useState<string[]>([]);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding.focus");
      if (!raw) return;
      const saved = JSON.parse(raw);
      const sel: string[] = Array.isArray(saved.sel) ? saved.sel : [];
      const targets: Record<string, number> = saved.targets ?? {};
      if (sel.length === 0) return;
      const next: FocusItem[] = sel.map((label) => {
        if (DETECT_KEYS.has(label)) {
          return { kind: "detect", label, detected: true };
        }
        const def = NUMERIC_DEFAULTS[label];
        if (!def) return { kind: "detect", label, detected: false };
        const max = typeof targets[label] === "number" ? targets[label] : def.max;
        return { kind: "numeric", label, value: def.current, max, unit: def.unit };
      });
      setFocus(next);
      setChips(sel);
    } catch {}
  }, []);

  return (
    <AppShell withBottomNav>
      <header className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="text-[13px] text-muted-foreground">안녕하세요</div>
          <h1 className="text-[20px] font-extrabold tracking-tight mt-0.5">다임님 👋</h1>
        </div>
        <button className="size-10 rounded-full bg-surface border border-border grid place-items-center" aria-label="알림">
          <Bell className="size-5" />
        </button>
      </header>

      <main className="px-5 pt-4 space-y-4">
        {/* Today nutrition status */}
        <section className="rounded-3xl p-5 bg-surface border border-border shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] text-muted-foreground">오늘의 영양 상태</div>
              <div className="mt-1 text-[18px] font-extrabold">잘 지키고 있어요</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-muted-foreground">목표 달성</div>
              <div className="text-[18px] font-extrabold text-primary">72%</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {focus.filter((f) => f.kind === "numeric").slice(0, 3).map((f) => {
              const n = f as NumericFocus;
              const remaining = n.max - n.value;
              const exceeded = remaining < 0;
              const ratio = n.value / n.max;
              const remainRatio = Math.max(0, Math.min(1, 1 - ratio));
              const fillPct = exceeded ? 100 : Math.round(remainRatio * 100);
              const color = exceeded
                ? "hsl(var(--destructive))"
                : remainRatio > 0.3
                ? "hsl(var(--success))"
                : "hsl(var(--warning))";
              const textColor = exceeded
                ? "text-destructive"
                : remainRatio > 0.3
                ? "text-success"
                : "text-warning-foreground";
              const R = 28;
              const C = 2 * Math.PI * R;
              const dash = (fillPct / 100) * C;
              return (
                <div key={n.label} className="flex flex-col items-center">
                  <div className="relative size-[72px]">
                    <svg viewBox="0 0 72 72" className="size-[72px] -rotate-90">
                      <circle cx="36" cy="36" r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                      <circle
                        cx="36" cy="36" r={R}
                        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${dash} ${C}`}
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <div>
                        <div className="text-[9px] text-muted-foreground leading-none">
                          {exceeded ? "초과" : "잔여량"}
                        </div>
                        <div className={`text-[13px] font-extrabold leading-tight mt-0.5 ${textColor}`}>
                          {exceeded ? `+${Math.abs(remaining)}${n.unit}` : `${remaining}${n.unit}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 text-[11px] text-center">
                    <span className="font-semibold">{n.label}</span>{" "}
                    <span className="text-muted-foreground">{n.value}/{n.max}{n.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {focus.some((f) => f.kind === "detect") && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {focus.filter((f) => f.kind === "detect").map((f) => {
                const d = f as DetectFocus;
                return (
                  <span
                    key={d.label}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      d.detected ? "bg-warning/15 text-warning-foreground" : "bg-success/15 text-success"
                    }`}
                  >
                    {d.label} · {d.detected ? "감지됨" : "없음"}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* Focus chips */}
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-[14px] font-bold">집중 관리 성분</h2>
            <Link to="/my/focus" className="text-[12px] text-muted-foreground flex items-center">
              편집 <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {chips.map((t) => (
              <span key={t} className="shrink-0 h-9 px-4 rounded-full bg-surface border border-border text-[13px] font-medium grid place-items-center">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* AI coach card */}
        <section className="rounded-3xl p-5 bg-surface border border-border flex gap-4">
          <Mascot size={48} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3" /> AI 코치 한마디
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground">
              오늘 나트륨이 평소보다 낮아요. 저녁엔 단백질을 챙겨보면 좋아요!
            </p>
          </div>
        </section>

        {/* Today eaten */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-[14px] font-bold">오늘 먹은 음식</h2>
            <Link to="/history" className="text-[12px] text-muted-foreground flex items-center">
              전체보기 <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <ul className="space-y-2">
            {eaten.map((e) => {
              const b = badge[e.status];
              return (
                <li key={e.name}>
                  <Link to="/history/$id" params={{ id: "1" }} className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border active:bg-muted/40">
                    <div className="size-12 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate">{e.name}</div>
                      <div className="text-[11.5px] text-muted-foreground">{e.brand} · {e.time}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${b.cls}`}>{b.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <BottomNav />
    </AppShell>
  );
}
