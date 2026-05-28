import { AlertTriangle, Sparkles, Leaf, Coffee, Droplet, FlaskConical, ArrowRight } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { cn } from "@/lib/utils";

type Verdict = "ok" | "warn" | "bad";

interface AnalysisViewProps {
  verdict?: Verdict;
}

const verdictMap: Record<Verdict, { title: string; sub: string; bg: string; emoji: string }> = {
  ok: { title: "괜찮아요", sub: "오늘 목표에 잘 맞아요", bg: "from-success to-success/70", emoji: "🌿" },
  warn: {
    title: "조금만 드세요",
    sub: "당류는 낮지만, 카페인과 대체당이 포함되어 있어요.",
    bg: "from-warning to-warning/80",
    emoji: "⚠️",
  },
  bad: { title: "오늘은 패스", sub: "나트륨이 목표를 초과해요", bg: "from-destructive to-destructive/70", emoji: "🚫" },
};

export function AnalysisView({ verdict = "warn" }: AnalysisViewProps) {
  const v = verdictMap[verdict];

  return (
    <main className="px-5 pt-2 pb-6 space-y-3.5">
      {/* Product summary */}
      <section className="rounded-3xl p-4 bg-surface border border-border flex gap-3">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] text-muted-foreground">코카콜라</div>
          <div className="text-[15.5px] font-bold mt-0.5 truncate">제로 콜라 500ml</div>
          <div className="mt-1.5 flex gap-1.5">
            <Tag>음료</Tag>
            <Tag>제로슈가</Tag>
          </div>
        </div>
      </section>

      {/* Main verdict — compact */}
      <section className={cn("rounded-3xl p-5 bg-gradient-to-br text-white relative overflow-hidden", v.bg)}>
        <div className="absolute -right-5 -top-5 text-[96px] opacity-20 leading-none select-none">{v.emoji}</div>
        <div className="text-[12px] font-medium opacity-90">잇핏의 판단</div>
        <h2 className="mt-0.5 text-[28px] font-black tracking-tight leading-tight">{v.title}</h2>
        <p className="mt-1.5 text-[13.5px] opacity-95 leading-relaxed pr-10">{v.sub}</p>
      </section>

      {/* AI coach comment */}
      <section className="rounded-3xl p-4 bg-primary-soft border border-primary/30 flex gap-3">
        <Mascot size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
            <Sparkles className="size-3" /> AI 코치 한마디
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground">
            다임님의 혈당 관리 목표엔 큰 무리 없어요. 다만 카페인에 민감하면 오후엔 피해주세요.
          </p>
        </div>
      </section>

      {/* Compact nutrition summary */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold">영양 요약</h3>
          <span className="text-[11px] text-muted-foreground">500ml 기준</span>
        </div>
        <ul className="mt-3 divide-y divide-border/70">
          <NutriRow icon={<Droplet className="size-4" />} label="당류" value="0g" status="낮음" tone="ok" />
          <NutriRow icon={<Leaf className="size-4" />} label="나트륨" value="45mg" status="낮음" tone="ok" />
          <NutriRow icon={<Coffee className="size-4" />} label="카페인" value="34mg" status="주의" tone="warn" />
          <NutriRow icon={<FlaskConical className="size-4" />} label="대체당" value="포함" status="확인 필요" tone="warn" />
        </ul>
      </section>

      {/* Ingredient / alt sweetener analysis */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <div className="flex items-center gap-1.5">
          <FlaskConical className="size-4 text-primary" />
          <h3 className="text-[14px] font-bold">원재료·대체당 분석</h3>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip tone="warn">아세설팜칼륨</Chip>
          <Chip tone="warn">대체당</Chip>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          단맛을 내는 감미료예요. 카페인에 민감하거나 장이 예민하다면 섭취량을 조절해보세요.
        </p>
      </section>

      {/* Alternative product recommendation */}
      <section className="rounded-3xl p-5 bg-gradient-to-br from-secondary/40 to-primary-soft border border-border">
        <h3 className="text-[14px] font-bold">대체 상품 추천</h3>
        <p className="mt-1 text-[12.5px] text-muted-foreground">카페인과 대체당 부담을 줄일 수 있어요.</p>
        <ul className="mt-3 space-y-2">
          {[
            { n: "무가당 탄산수", t: "당 0g · 카페인 0mg" },
            { n: "카페인 없는 보리차", t: "디카페인 · 부드러운 곡물맛" },
          ].map((p) => (
            <li key={p.n} className="flex items-center gap-3 p-3 rounded-2xl bg-surface">
              <div className="size-10 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold truncate">{p.n}</div>
                <div className="text-[11.5px] text-muted-foreground">{p.t}</div>
              </div>
              <ArrowRight className="size-4 text-primary" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
      {children}
    </span>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone?: "warn" }) {
  return (
    <span
      className={cn(
        "text-[11.5px] font-medium px-2.5 py-1 rounded-full",
        tone === "warn" ? "bg-warning/15 text-warning-foreground" : "bg-muted text-muted-foreground"
      )}
    >
      {children}
    </span>
  );
}

function NutriRow({
  icon,
  label,
  value,
  status,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: string;
  tone: "ok" | "warn";
}) {
  return (
    <li className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
      <div
        className={cn(
          "size-8 rounded-full grid place-items-center shrink-0",
          tone === "ok" ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{label}</div>
        <div className="text-[11.5px] text-muted-foreground">{value}</div>
      </div>
      <span
        className={cn(
          "text-[11.5px] font-semibold px-2.5 py-1 rounded-full",
          tone === "ok" ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground"
        )}
      >
        {status}
      </span>
    </li>
  );
}
