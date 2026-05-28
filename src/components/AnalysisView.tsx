import { AlertTriangle, Info, Sparkles } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { cn } from "@/lib/utils";

type Verdict = "ok" | "warn" | "bad";

interface AnalysisViewProps {
  verdict?: Verdict;
}

const verdictMap: Record<Verdict, { title: string; sub: string; bg: string; emoji: string }> = {
  ok: { title: "괜찮아요", sub: "오늘 목표에 잘 맞아요", bg: "from-success to-success/70", emoji: "🌿" },
  warn: { title: "조금만 드세요", sub: "당류가 살짝 높은 편이에요", bg: "from-warning to-warning/70", emoji: "⚠️" },
  bad: { title: "오늘은 패스", sub: "나트륨이 목표를 초과해요", bg: "from-destructive to-destructive/70", emoji: "🚫" },
};

export function AnalysisView({ verdict = "warn" }: AnalysisViewProps) {
  const v = verdictMap[verdict];

  return (
    <main className="px-5 pt-2 pb-6 space-y-3.5">
      {/* Product summary */}
      <section className="rounded-3xl p-4 bg-surface border border-border flex gap-3">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] text-muted-foreground">코카콜라</div>
          <div className="text-[15.5px] font-bold mt-0.5 truncate">제로 콜라 500ml</div>
          <div className="mt-1.5 flex gap-1.5">
            <Tag>음료</Tag>
            <Tag>제로슈가</Tag>
          </div>
        </div>
      </section>

      {/* Main verdict */}
      <section className={cn("rounded-3xl p-6 bg-gradient-to-br text-white relative overflow-hidden", v.bg)}>
        <div className="absolute -right-6 -top-6 text-[120px] opacity-20 leading-none select-none">{v.emoji}</div>
        <div className="text-[12.5px] font-medium opacity-90">잇핏의 판단</div>
        <h2 className="mt-1 text-[32px] font-black tracking-tight leading-tight">{v.title}</h2>
        <p className="mt-1.5 text-[14px] opacity-95">{v.sub}</p>

        <ul className="mt-5 space-y-1.5">
          {[
            "당류 0g 으로 혈당 부담은 낮아요",
            "카페인이 포함되어 있어요",
            "인공감미료(아세설팜칼륨) 함유",
          ].map((r) => (
            <li key={r} className="flex items-start gap-2 text-[13px]">
              <span className="mt-1.5 size-1.5 rounded-full bg-white/90 shrink-0" />
              <span className="opacity-95">{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Warning ingredients */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-4 text-warning" />
          <h3 className="text-[14px] font-bold">주의 성분</h3>
        </div>
        <div className="mt-3 space-y-2">
          <WarnRow name="카페인" value="34mg" note="하루 권장량의 8%" tone="warn" />
          <WarnRow name="아세설팜칼륨" value="대체당" note="장 건강 영향 가능" tone="warn" />
          <WarnRow name="인산" value="첨가" note="과다 섭취 주의" tone="warn" />
        </div>
      </section>

      {/* AI coach comment */}
      <section className="rounded-3xl p-5 bg-primary-soft border border-primary/30 flex gap-3">
        <Mascot size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
            <Sparkles className="size-3" /> AI 코치 한마디
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-foreground">
            다임님의 혈당 관리 목표엔 큰 무리 없어요. 다만 카페인 민감하면 오후엔 피해주세요.
          </p>
        </div>
      </section>

      {/* Nutrition summary */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold">영양 성분</h3>
          <span className="text-[11px] text-muted-foreground">100ml 기준</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            { l: "열량", v: "0", u: "kcal" },
            { l: "당류", v: "0", u: "g" },
            { l: "나트륨", v: "10", u: "mg" },
            { l: "카페인", v: "7", u: "mg" },
          ].map((n) => (
            <div key={n.l} className="rounded-2xl bg-muted/60 py-3">
              <div className="text-[11px] text-muted-foreground">{n.l}</div>
              <div className="mt-0.5 text-[16px] font-extrabold">{n.v}</div>
              <div className="text-[10px] text-muted-foreground">{n.u}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredient analysis */}
      <section className="rounded-3xl p-5 bg-surface border border-border">
        <div className="flex items-center gap-1.5">
          <Info className="size-4 text-primary" />
          <h3 className="text-[14px] font-bold">원재료 · 대체당 분석</h3>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
          정제수, 탄산가스, 카라멜색소, 인산, 천연향료, 아세설팜칼륨, 수크랄로스, 카페인
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip tone="warn">아세설팜칼륨</Chip>
          <Chip tone="warn">수크랄로스</Chip>
          <Chip tone="warn">카페인</Chip>
          <Chip>탄산가스</Chip>
        </div>
      </section>

      {/* Alternative recommendation */}
      <section className="rounded-3xl p-5 bg-gradient-to-br from-secondary/40 to-primary-soft border border-border">
        <h3 className="text-[14px] font-bold">대체 제품 추천</h3>
        <p className="mt-1 text-[12.5px] text-muted-foreground">목표에 더 잘 맞는 옵션이에요</p>
        <ul className="mt-3 space-y-2">
          {[
            { n: "탄산수 레몬 500ml", t: "당 0g · 카페인 0mg" },
            { n: "콤부차 오리지널", t: "프로바이오틱스 함유" },
          ].map((p) => (
            <li key={p.n} className="flex items-center gap-3 p-3 rounded-2xl bg-surface">
              <div className="size-10 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold truncate">{p.n}</div>
                <div className="text-[11.5px] text-muted-foreground">{p.t}</div>
              </div>
              <span className="text-[11px] font-semibold text-primary">자세히</span>
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

function WarnRow({ name, value, note, tone }: { name: string; value: string; note: string; tone: "warn" }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-warning/10">
      <div className={cn("size-8 rounded-full grid place-items-center", tone === "warn" && "bg-warning/30 text-warning-foreground")}>
        <AlertTriangle className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{name}</div>
        <div className="text-[11.5px] text-muted-foreground">{note}</div>
      </div>
      <span className="text-[12px] font-bold">{value}</span>
    </div>
  );
}
