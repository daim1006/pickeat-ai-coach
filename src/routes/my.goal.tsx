import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";
import { Scale, Droplet, Salad, HeartPulse, Dumbbell } from "lucide-react";

export const Route = createFileRoute("/my/goal")({
  component: GoalEdit,
});

const goals = [
  { id: "weight", label: "체중 관리", desc: "칼로리와 당류를 함께 봐드려요", icon: Scale },
  { id: "blood", label: "혈당 관리", desc: "당류와 GI 영향 성분을 체크해요", icon: Droplet },
  { id: "sodium", label: "나트륨 줄이기", desc: "숨은 나트륨까지 찾아드려요", icon: HeartPulse },
  { id: "gut", label: "장 건강", desc: "식이섬유와 첨가물을 봐드려요", icon: Salad },
  { id: "protein", label: "단백질 중심", desc: "단백질 비율을 우선 분석해요", icon: Dumbbell },
];

function GoalEdit() {
  const router = useRouter();
  const [sel, setSel] = useState("weight");

  return (
    <AppShell>
      <TopBar title="건강 목표" />
      <div className="flex-1 flex flex-col px-5 pb-8">
        <p className="text-[13px] text-muted-foreground">목표를 바꾸면 분석 기준도 함께 바뀝니다</p>
        <div className="mt-5 space-y-2.5">
          {goals.map((g) => {
            const Icon = g.icon;
            const active = sel === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSel(g.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border text-left",
                  active ? "border-primary bg-primary-soft" : "border-border bg-surface"
                )}
              >
                <div className={cn("size-12 rounded-xl grid place-items-center", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold">{g.label}</div>
                  <div className="text-[12px] text-muted-foreground">{g.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex-1 min-h-6" />
        <button
          onClick={() => router.history.back()}
          className="h-14 mt-6 rounded-2xl bg-primary text-primary-foreground text-base font-semibold"
        >
          저장
        </button>
      </div>
    </AppShell>
  );
}
