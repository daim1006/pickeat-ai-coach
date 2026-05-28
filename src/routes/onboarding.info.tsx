import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/info")({
  component: OnbInfo,
});

const genders = ["여성", "남성", "선택 안함"];
const ages = ["10대", "20대", "30대", "40대", "50대+"];

function OnbInfo() {
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const ready = gender && age;

  return (
    <AppShell>
      <TopBar title="1 / 4" />
      <div className="flex-1 flex flex-col px-6 pb-10">
        <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
          기본 정보를<br />알려주세요
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">맞춤 분석에 최소한으로만 사용해요</p>

        <Section label="성별">
          <div className="grid grid-cols-3 gap-2">
            {genders.map((g) => (
              <Pill key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Pill>
            ))}
          </div>
        </Section>

        <Section label="연령대">
          <div className="grid grid-cols-3 gap-2">
            {ages.map((a) => (
              <Pill key={a} active={age === a} onClick={() => setAge(a)}>{a}</Pill>
            ))}
          </div>
        </Section>

        <div className="flex-1" />
        <Link
          to="/onboarding/goal"
          aria-disabled={!ready}
          className={cn(
            "h-14 rounded-2xl text-base font-semibold grid place-items-center transition-all",
            ready ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground pointer-events-none"
          )}
        >
          다음
        </Link>
      </div>
    </AppShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <div className="text-[13px] font-semibold text-muted-foreground mb-3">{label}</div>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-12 rounded-xl text-[14px] font-medium border transition-all",
        active
          ? "bg-primary-soft border-primary text-foreground"
          : "bg-surface border-border text-foreground active:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
