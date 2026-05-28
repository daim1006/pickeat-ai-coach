import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/onboarding/focus")({
  component: OnbFocus,
});

type NumericKey = "당류" | "나트륨" | "포화지방" | "카페인" | "단백질";
type DetectKey = "대체당" | "첨가물";
type Key = NumericKey | DetectKey;

const items: Key[] = ["당류", "나트륨", "카페인", "포화지방", "단백질", "대체당", "첨가물"];

type NumericCfg = {
  kind: "numeric";
  label: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  defaultValue: number;
  note: string;
};
type DetectCfg = {
  kind: "detect";
  label: string;
  body: string;
  note: string;
};

const config: Record<Key, NumericCfg | DetectCfg> = {
  당류: { kind: "numeric", label: "당류 목표량", unit: "g", step: 5, min: 20, max: 200, defaultValue: 70, note: "기준 권장량 100g · 선택한 목표에 맞춰 낮게 설정했어요." },
  나트륨: { kind: "numeric", label: "나트륨 목표량", unit: "mg", step: 100, min: 500, max: 3000, defaultValue: 1500, note: "기준 권장량 2000mg · 나트륨 줄이기 목표에 맞춰 낮게 설정했어요." },
  포화지방: { kind: "numeric", label: "포화지방 목표량", unit: "g", step: 1, min: 3, max: 30, defaultValue: 10, note: "기준 권장량 15g · 체중 관리 목표에 맞춰 낮게 설정했어요." },
  카페인: { kind: "numeric", label: "카페인 목표량", unit: "mg", step: 25, min: 50, max: 500, defaultValue: 300, note: "카페인 민감도에 따라 조절할 수 있어요." },
  단백질: { kind: "numeric", label: "단백질 목표량", unit: "g", step: 5, min: 30, max: 200, defaultValue: 70, note: "단백질 중심 목표에 맞춰 충분히 설정했어요." },
  대체당: { kind: "detect", label: "대체당 관리 방식", body: "원재료명에서 대체당을 감지하면 알려드려요.", note: "예: 아세설팜칼륨, 수크랄로스, 아스파탐" },
  첨가물: { kind: "detect", label: "첨가물 관리 방식", body: "원재료명에서 주의 첨가물을 감지하면 알려드려요.", note: "기준값이 아닌 성분 감지 중심으로 관리해요." },
};

const defaultValues: Record<string, number> = {
  당류: 70, 나트륨: 1500, 포화지방: 10, 카페인: 300, 단백질: 70,
};

function OnbFocus() {
  const [sel, setSel] = useState<Key[]>(["당류", "나트륨"]);
  const [values, setValues] = useState<Record<string, number>>(defaultValues);

  useEffect(() => {
    try {
      const savedFocus = localStorage.getItem("onboarding.focus");
      if (savedFocus) {
        const parsed = JSON.parse(savedFocus);
        if (Array.isArray(parsed.sel)) setSel(parsed.sel.filter((k: string) => (items as string[]).includes(k)) as Key[]);
        if (parsed.values) setValues((p) => ({ ...p, ...parsed.values }));
        return;
      }
      const goalRaw = localStorage.getItem("onboarding.healthGoal");
      if (goalRaw) {
        const goal = JSON.parse(goalRaw);
        if (Array.isArray(goal.focus)) {
          const next = goal.focus.filter((k: string) => (items as string[]).includes(k)) as Key[];
          if (next.length > 0) setSel(next);
        }
      }
    } catch {}
  }, []);

  const toggle = (v: Key) =>
    setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const updateValue = (k: Key, delta: number) => {
    const cfg = config[k];
    if (cfg.kind !== "numeric") return;
    setValues((p) => ({
      ...p,
      [k]: Math.max(cfg.min, Math.min(cfg.max, (p[k] ?? cfg.defaultValue) + delta)),
    }));
  };

  const handleSave = () => {
    try {
      const goalRaw = localStorage.getItem("onboarding.healthGoal");
      const targets: Record<string, number> = {};
      const management: Record<string, string> = {};
      sel.forEach((k) => {
        const cfg = config[k];
        if (cfg.kind === "numeric") targets[k] = values[k] ?? cfg.defaultValue;
        else management[k] = "detect";
      });
      localStorage.setItem(
        "onboarding.focus",
        JSON.stringify({
          selectedHealthGoal: goalRaw ? JSON.parse(goalRaw) : null,
          sel,
          values,
          targets,
          management,
        })
      );
    } catch {}
  };

  return (
    <AppShell>
      <TopBar title="3 / 4" />
      <div className="flex-1 flex flex-col px-6 pb-10">
        <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
          줄이고 싶은 성분을<br />골라주세요
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">
          성별과 만 나이를 기준으로 기본값을 설정하고, 목표에 맞게 조절할 수 있어요.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {items.map((it) => {
            const active = sel.includes(it);
            return (
              <button
                key={it}
                onClick={() => toggle(it)}
                className={cn(
                  "h-11 px-5 rounded-full text-[14px] font-medium border transition-all",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-foreground border-border"
                )}
              >
                {it}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-2.5">
          {sel.map((k) => {
            const cfg = config[k];
            if (cfg.kind === "numeric") {
              const value = values[k] ?? cfg.defaultValue;
              return (
                <div key={k} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="text-[13px] font-semibold">{cfg.label}</div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/40 px-2 py-1.5">
                    <button
                      onClick={() => updateValue(k, -cfg.step)}
                      className="size-9 rounded-lg bg-surface border border-border grid place-items-center active:bg-muted"
                      aria-label="감소"
                    >
                      <Minus className="size-4" />
                    </button>
                    <div className="text-[15px] font-bold tabular-nums">
                      {value}
                      <span className="text-[12px] font-medium text-muted-foreground ml-1">{cfg.unit} / day</span>
                    </div>
                    <button
                      onClick={() => updateValue(k, cfg.step)}
                      className="size-9 rounded-lg bg-surface border border-border grid place-items-center active:bg-muted"
                      aria-label="증가"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted-foreground">{cfg.note}</p>
                </div>
              );
            }
            return (
              <div key={k} className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-[13px] font-semibold">{cfg.label}</div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/85">{cfg.body}</p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">{cfg.note}</p>
              </div>
            );
          })}
        </div>

        <div className="flex-1 min-h-6" />

        <p className="text-[11.5px] text-muted-foreground/80 mt-4 mb-3">
          기본값은 마이페이지에서 언제든 수정할 수 있어요.
        </p>

        <Link
          to="/onboarding/restricted"
          onClick={handleSave}
          className={cn(
            "h-14 rounded-2xl text-base font-semibold grid place-items-center",
            sel.length > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground pointer-events-none"
          )}
        >
          다음
        </Link>
      </div>
    </AppShell>
  );
}
