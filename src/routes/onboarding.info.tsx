import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/info")({
  component: OnbInfo,
});

const genders = ["여성", "남성", "선택 안함"];

function OnbInfo() {
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const ageNum = parseInt(age, 10);
  const ready = !!gender && !isNaN(ageNum) && ageNum > 0 && ageNum < 120;

  return (
    <AppShell>
      <TopBar title="1 / 4" />
      <div className="flex-1 flex flex-col px-6 pb-10">
        <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
          기본 정보를<br />알려주세요
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">
          입력한 정보로 한국인 영양섭취기준에 맞춘 기본 권장량을 설정해요.
        </p>

        <Section label="성별">
          <div className="grid grid-cols-3 gap-2">
            {genders.map((g) => (
              <Pill key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Pill>
            ))}
          </div>
        </Section>

        <Section label="만 나이">
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
              placeholder="예: 24"
              className="w-full h-14 rounded-2xl border border-border bg-surface px-4 pr-12 text-[16px] font-medium outline-none focus:border-primary transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">세</span>
          </div>
        </Section>

        <div className="flex-1 min-h-8" />

        <p className="text-[11.5px] leading-relaxed text-muted-foreground/80 mb-3">
          잇핏은 일반 건강관리 참고용 서비스이며, 의료적 판단을 대체하지 않아요.
        </p>

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
