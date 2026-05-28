import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/focus")({
  component: OnbFocus,
});

const items = ["당", "나트륨", "카페인", "포화지방", "대체당", "첨가물"];

function OnbFocus() {
  const [sel, setSel] = useState<string[]>(["당", "나트륨"]);
  const toggle = (v: string) =>
    setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  return (
    <AppShell>
      <TopBar title="3 / 4" />
      <div className="flex-1 flex flex-col px-6 pb-10">
        <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
          줄이고 싶은 성분을<br />골라주세요
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">여러 개 선택할 수 있어요</p>

        <div className="mt-8 flex flex-wrap gap-2.5">
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

        <div className="flex-1" />
        <Link
          to="/onboarding/restricted"
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
