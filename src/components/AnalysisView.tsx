import { Sparkles, ArrowRight } from "lucide-react";
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

      {/* Scanned nutrition facts table */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <h3 className="text-[14px] font-bold">스캔한 영양성분표</h3>
        <p className="mt-1 text-[12px] text-muted-foreground">잇핏이 성분표를 이렇게 읽었어요</p>

        <div className="mt-3 rounded-2xl border border-border/70 overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1fr_0.9fr] px-3.5 py-2 bg-muted/50 text-[11px] font-semibold text-muted-foreground">
            <span>성분</span>
            <span>함량</span>
            <span className="text-right">판정</span>
          </div>
          <ul className="divide-y divide-border/60">
            {[
              { n: "당류", v: "0g", s: "낮음", t: "ok" as const },
              { n: "나트륨", v: "45mg", s: "낮음", t: "ok" as const },
              { n: "카페인", v: "34mg", s: "주의", t: "warn" as const },
              { n: "대체당", v: "포함", s: "확인 필요", t: "warn" as const },
            ].map((r) => (
              <li key={r.n} className="grid grid-cols-[1.2fr_1fr_0.9fr] items-center px-3.5 py-2.5">
                <span className="text-[13px] font-semibold">{r.n}</span>
                <span className="text-[13px] text-muted-foreground">{r.v}</span>
                <span className="justify-self-end">
                  <StatusBadge tone={r.t}>{r.s}</StatusBadge>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ingredient analysis */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <h3 className="text-[14px] font-bold">원재료명 분석</h3>
        <p className="mt-1 text-[12px] text-muted-foreground">원재료명에서 주의할 성분만 골라 정리했어요</p>

        {/* Risk summary */}
        <div className="mt-4">
          <div className="text-[11.5px] font-semibold text-foreground/80">성분 위험도</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <RiskChip tone="ok">낮음 2개</RiskChip>
            <RiskChip tone="warn">주의 3개</RiskChip>
            <RiskChip tone="bad">피해야 함 0개</RiskChip>
          </div>
        </div>

        {/* Raw ingredient text */}
        <div className="mt-4">
          <div className="text-[11.5px] font-semibold text-foreground/80">원재료명 원문</div>
          <div className="mt-2 rounded-2xl bg-muted/40 px-3.5 py-3">
            <p className="text-[12.5px] leading-relaxed text-foreground/75">
              정제수, 이산화탄소, 카라멜색소, 인산, 카페인, 아세설팜칼륨, 수크랄로스
            </p>
          </div>
        </div>

        {/* Warning ingredient list */}
        <div className="mt-4">
          <div className="text-[11.5px] font-semibold text-foreground/80">주의 성분</div>
          <ul className="mt-2 rounded-2xl border border-border/70 bg-background divide-y divide-border/60 overflow-hidden">
            {[
              { n: "아세설팜칼륨", c: "대체당", i: "단맛을 내는 감미료예요." },
              { n: "수크랄로스", c: "대체당", i: "장이 예민하면 섭취량을 조절해보세요." },
              { n: "카페인", c: "각성 성분", i: "민감하면 오후 섭취를 줄여보세요." },
              { n: "인산", c: "첨가물", i: "과다 섭취는 주의가 필요해요." },
            ].map((r) => (
              <li key={r.n} className="px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="warn">주의</StatusBadge>
                  <span className="text-[13.5px] font-semibold">{r.n}</span>
                  <span className="text-[11px] text-muted-foreground ml-auto">{r.c}</span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-foreground/75">{r.i}</p>
              </li>
            ))}
          </ul>
        </div>
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

function RiskChip({ children, tone }: { children: React.ReactNode; tone: "ok" | "warn" | "bad" }) {
  const styles =
    tone === "ok"
      ? "bg-success/15 text-success"
      : tone === "warn"
        ? "bg-warning/20 text-warning-foreground"
        : "bg-destructive/15 text-destructive";
  return (
    <span className={cn("text-[11.5px] font-semibold px-2.5 py-1 rounded-full", styles)}>
      {children}
    </span>
  );
}

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "ok" | "warn" }) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold px-2 py-0.5 rounded-full",
        tone === "ok" ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground"
      )}
    >
      {children}
    </span>
  );
}

