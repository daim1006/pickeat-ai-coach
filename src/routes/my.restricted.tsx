import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/my/restricted")({
  component: RestrictedEdit,
});

const items = ["유제품", "견과류", "갑각류", "글루텐", "계란", "과일류"];

function RestrictedEdit() {
  const router = useRouter();
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (v: string) => setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  return (
    <AppShell>
      <TopBar title="피해야 할 성분" />
      <div className="flex-1 flex flex-col px-5 pb-8">
        <p className="text-[13px] text-muted-foreground">선택한 성분이 들어있으면 강하게 알려드려요</p>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {items.map((it) => {
            const active = sel.includes(it);
            return (
              <button
                key={it}
                onClick={() => toggle(it)}
                className={cn(
                  "h-16 rounded-2xl text-[14px] font-semibold border",
                  active ? "bg-destructive/10 text-destructive border-destructive" : "bg-surface border-border"
                )}
              >
                {it}
              </button>
            );
          })}
          <button className="h-16 rounded-2xl text-[13px] font-medium border border-dashed text-muted-foreground flex items-center justify-center gap-1">
            <Plus className="size-4" /> 직접 입력
          </button>
        </div>
        <div className="flex-1" />
        <button onClick={() => router.history.back()} className="h-14 rounded-2xl bg-primary text-primary-foreground text-base font-semibold">
          저장
        </button>
      </div>
    </AppShell>
  );
}
