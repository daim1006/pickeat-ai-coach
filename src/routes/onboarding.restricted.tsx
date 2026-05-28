import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/onboarding/restricted")({
  component: OnbRestricted,
});

const items = ["유제품", "견과류", "갑각류", "글루텐", "계란", "과일류"];

function OnbRestricted() {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (v: string) =>
    setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  return (
    <AppShell>
      <TopBar title="4 / 4" />
      <div className="flex-1 flex flex-col px-6 pb-10">
        <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
          피해야 하는<br />성분이 있나요?
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">없다면 건너뛸 수 있어요</p>

        <div className="mt-8 grid grid-cols-3 gap-2.5">
          {items.map((it) => {
            const active = sel.includes(it);
            return (
              <button
                key={it}
                onClick={() => toggle(it)}
                className={cn(
                  "h-16 rounded-2xl text-[14px] font-semibold border transition-all",
                  active
                    ? "bg-destructive/10 text-destructive border-destructive"
                    : "bg-surface text-foreground border-border"
                )}
              >
                {it}
              </button>
            );
          })}
          <button className="h-16 rounded-2xl text-[13px] font-medium border border-dashed border-border text-muted-foreground flex items-center justify-center gap-1">
            <Plus className="size-4" /> 직접 입력
          </button>
        </div>

        <div className="flex-1" />
        <div className="space-y-2">
          <Link
            to="/onboarding/complete"
            className="h-14 rounded-2xl text-base font-semibold grid place-items-center bg-primary text-primary-foreground"
          >
            완료
          </Link>
          <Link to="/onboarding/complete" className="h-12 text-[14px] font-medium grid place-items-center text-muted-foreground">
            건너뛰기
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
