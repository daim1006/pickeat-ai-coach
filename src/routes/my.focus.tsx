import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my/focus")({
  component: FocusEdit,
});

const items = ["당", "나트륨", "카페인", "포화지방", "대체당", "첨가물"];

function FocusEdit() {
  const router = useRouter();
  const [sel, setSel] = useState<string[]>(["당", "나트륨"]);
  const toggle = (v: string) => setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

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
