import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my/focus")({
  component: FocusEdit,
});

const items = ["당류", "나트륨", "카페인", "포화지방", "단백질", "대체당", "첨가물"];
const NUMERIC = new Set(["당류", "나트륨", "카페인", "포화지방", "단백질"]);
const STORAGE_KEY = "onboarding.focus";

const defaultValues: Record<string, number> = {
  당류: 70, 나트륨: 1500, 포화지방: 10, 카페인: 300, 단백질: 70,
};

function FocusEdit() {
  const router = useRouter();
  const [sel, setSel] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, number>>(defaultValues);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.sel)) setSel(p.sel.filter((k: string) => items.includes(k)));
        if (p.values) setValues((prev) => ({ ...prev, ...p.values }));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = (v: string) => setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  useEffect(() => {
    if (!loaded) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const prev = raw ? JSON.parse(raw) : {};
      const targets: Record<string, number> = {};
      const management: Record<string, string> = {};
      sel.forEach((k) => {
        if (NUMERIC.has(k)) targets[k] = values[k] ?? defaultValues[k];
        else management[k] = "detect";
      });
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...prev, sel, values, targets, management })
      );
    } catch {}
  }, [sel, values, loaded]);

  return (
    <AppShell>
      <TopBar title="집중 관리 성분" />
      <div className="flex-1 flex flex-col px-5 pb-8">
        <p className="text-[13px] text-muted-foreground">선택한 성분 위주로 알려드릴게요</p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {items.map((it) => {
            const active = sel.includes(it);
            return (
              <button
                key={it}
                onClick={() => toggle(it)}
                className={cn(
                  "h-11 px-5 rounded-full text-[14px] font-medium border",
                  active ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border"
                )}
              >
                {it}
              </button>
            );
          })}
        </div>
        <div className="flex-1" />
        <button onClick={() => router.history.back()} className="h-14 rounded-2xl bg-primary text-primary-foreground text-base font-semibold">
          저장
        </button>
      </div>
    </AppShell>
  );
}
