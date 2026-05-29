import { Sparkles, ArrowRight } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { cn } from "@/lib/utils";


type Verdict = "ok" | "warn" | "bad";
type Tone = "ok" | "warn" | "bad";

export type AnalysisData = {
  product?: { name?: string; brand?: string; tags?: string[] };
  verdict?: Verdict;
  verdictSub?: string;
  coachComment?: string;
  nutrition?: Array<{ name: string; value: string; status: string; tone: Tone }>;
  ingredientsRaw?: string;
  warnings?: Array<{ name: string; category: string; info: string }>;
  riskCounts?: { ok?: number; warn?: number; bad?: number };
  alternatives?: Array<{ name: string; tagline: string }>;
};

interface AnalysisViewProps {
  verdict?: Verdict;
  data?: AnalysisData | null;
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

// Demo fallback used by pages that don't provide explicit data (e.g. history detail).
const DEMO: Required<Pick<AnalysisData, "product" | "coachComment" | "nutrition" | "ingredientsRaw" | "warnings" | "riskCounts" | "alternatives">> = {
  product: { name: "제로 콜라 500ml", brand: "코카콜라", tags: ["음료", "제로슈가"] },
  coachComment:
    "다임님의 혈당 관리 목표엔 큰 무리 없어요. 다만 카페인에 민감하면 오후엔 피해주세요.",
  nutrition: [
    { name: "당류", value: "0g", status: "낮음", tone: "ok" },
    { name: "나트륨", value: "45mg", status: "낮음", tone: "ok" },
    { name: "카페인", value: "34mg", status: "주의", tone: "warn" },
    { name: "대체당", value: "포함", status: "확인 필요", tone: "warn" },
  ],
  ingredientsRaw: "정제수, 이산화탄소, 카라멜색소, 인산, 카페인, 아세설팜칼륨, 수크랄로스",
  warnings: [
    { name: "아세설팜칼륨", category: "대체당", info: "단맛을 내는 감미료예요." },
    { name: "수크랄로스", category: "대체당", info: "장이 예민하면 섭취량을 조절해보세요." },
    { name: "카페인", category: "각성 성분", info: "민감하면 오후 섭취를 줄여보세요." },
    { name: "인산", category: "첨가물", info: "과다 섭취는 주의가 필요해요." },
  ],
  riskCounts: { ok: 2, warn: 3, bad: 0 },
  alternatives: [
    { name: "무가당 탄산수", tagline: "당 0g · 카페인 0mg" },
    { name: "카페인 없는 보리차", tagline: "디카페인 · 부드러운 곡물맛" },
  ],
};

export function AnalysisView({ verdict, data }: AnalysisViewProps) {
  // When `data` is explicitly provided, use ONLY that data (don't merge demo
  // so we never show stale "코카콜라 제로 콜라" text on a fresh scan).
  const useDemo = data === undefined;
  const product = useDemo ? DEMO.product : data?.product ?? {};
  const coachComment = useDemo ? DEMO.coachComment : data?.coachComment ?? "";
  const nutrition = useDemo ? DEMO.nutrition : data?.nutrition ?? [];
  const ingredientsRaw = useDemo ? DEMO.ingredientsRaw : data?.ingredientsRaw ?? "";
  const warnings = useDemo ? DEMO.warnings : data?.warnings ?? [];
  const riskCounts = useDemo ? DEMO.riskCounts : data?.riskCounts ?? {};
  const alternatives = useDemo ? DEMO.alternatives : data?.alternatives ?? [];

  const resolvedVerdict: Verdict = verdict ?? data?.verdict ?? "warn";
  const v = verdictMap[resolvedVerdict];
  const verdictSub = data?.verdictSub ?? v.sub;

  return (
    <main className="px-5 pt-2 pb-6 space-y-3.5">
      {/* Product summary */}
      <section className="rounded-3xl p-4 bg-surface border border-border flex gap-3">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] text-muted-foreground">{product.brand || "—"}</div>
          <div className="text-[15.5px] font-bold mt-0.5 truncate">{product.name || "분석된 상품"}</div>
          <div className="mt-1.5 flex gap-1.5">
            {(product.tags ?? []).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </section>

      {/* Main verdict — compact */}
      <section className={cn("rounded-3xl p-5 bg-gradient-to-br text-white relative overflow-hidden", v.bg)}>
        <div className="absolute -right-5 -top-5 text-[96px] opacity-20 leading-none select-none">{v.emoji}</div>
        <div className="text-[12px] font-medium opacity-90">잇핏의 판단</div>
        <h2 className="mt-0.5 text-[28px] font-black tracking-tight leading-tight">{v.title}</h2>
        <p className="mt-1.5 text-[13.5px] opacity-95 leading-relaxed pr-10">{verdictSub}</p>
      </section>

      {/* AI coach comment */}
      {coachComment && (
        <section className="rounded-3xl p-4 bg-primary-soft border border-primary/30 flex gap-3">
          <Mascot size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3" /> AI 코치 한마디
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground">{coachComment}</p>
          </div>
        </section>
      )}

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
          {nutrition.length > 0 ? (
            <ul className="divide-y divide-border/60">
              {nutrition.map((r) => (
                <li key={r.name} className="grid grid-cols-[1.2fr_1fr_0.9fr] items-center px-3.5 py-2.5">
                  <span className="text-[13px] font-semibold">{r.name}</span>
                  <span className="text-[13px] text-muted-foreground">{r.value}</span>
                  <span className="justify-self-end">
                    <StatusBadge tone={r.tone === "bad" ? "warn" : r.tone}>{r.status}</StatusBadge>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3.5 py-6 text-center text-[12px] text-muted-foreground">
              영양 성분 정보를 읽지 못했어요
            </div>
          )}
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
            <RiskChip tone="ok">낮음 {riskCounts.ok ?? 0}개</RiskChip>
            <RiskChip tone="warn">주의 {riskCounts.warn ?? 0}개</RiskChip>
            <RiskChip tone="bad">피해야 함 {riskCounts.bad ?? 0}개</RiskChip>
          </div>
        </div>

        {/* Raw ingredient text */}
        <div className="mt-4">
          <div className="text-[11.5px] font-semibold text-foreground/80">원재료명 원문</div>
          <div className="mt-2 rounded-2xl bg-muted/40 px-3.5 py-3">
            <p className="text-[12.5px] leading-relaxed text-foreground/75">
              {ingredientsRaw || "원재료명을 읽지 못했어요"}
            </p>
          </div>
        </div>

        {/* Warning ingredient list */}
        {warnings.length > 0 && (
          <div className="mt-4">
            <div className="text-[11.5px] font-semibold text-foreground/80">주의 성분</div>
            <ul className="mt-2 rounded-2xl border border-border/70 bg-background divide-y divide-border/60 overflow-hidden">
              {warnings.map((r) => (
                <li key={r.name} className="px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge tone="warn">주의</StatusBadge>
                    <span className="text-[13.5px] font-semibold">{r.name}</span>
                    <span className="text-[11px] text-muted-foreground ml-auto">{r.category}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-foreground/75">{r.info}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>


      {/* Alternative product recommendation */}
      {alternatives.length > 0 && (
        <section className="rounded-3xl p-5 bg-gradient-to-br from-secondary/40 to-primary-soft border border-border">
          <h3 className="text-[14px] font-bold">대체 상품 추천</h3>
          <p className="mt-1 text-[12.5px] text-muted-foreground">부담을 줄일 수 있는 대안이에요.</p>
          <ul className="mt-3 space-y-2">
            {alternatives.map((p) => (
              <li key={p.name} className="flex items-center gap-3 p-3 rounded-2xl bg-surface">
                <div className="size-10 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold truncate">{p.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{p.tagline}</div>
                </div>
                <ArrowRight className="size-4 text-primary" />
              </li>
            ))}
          </ul>
        </section>
      )}
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

/**
 * Normalize an unknown n8n response shape into AnalysisData.
 * Tries common key names and falls back to safe defaults.
 */
export function normalizeAnalysis(raw: unknown): AnalysisData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, any>;
  const src = (r.analysis && typeof r.analysis === "object" ? r.analysis : r) as Record<string, any>;

  const productSrc = src.product ?? {};
  const product = {
    name: productSrc.name ?? src.productName ?? src.name,
    brand: productSrc.brand ?? src.brand,
    tags: Array.isArray(productSrc.tags) ? productSrc.tags : Array.isArray(src.tags) ? src.tags : undefined,
  };

  const verdict: Verdict | undefined =
    src.verdict === "ok" || src.verdict === "warn" || src.verdict === "bad" ? src.verdict : undefined;

  const nutritionSrc = Array.isArray(src.nutrition) ? src.nutrition : [];
  const nutrition = nutritionSrc
    .map((n: any) => {
      if (!n) return null;
      const tone: Tone =
        n.tone === "ok" || n.tone === "warn" || n.tone === "bad"
          ? n.tone
          : n.status === "낮음"
            ? "ok"
            : n.status === "높음"
              ? "bad"
              : "warn";
      return {
        name: String(n.name ?? n.label ?? ""),
        value: String(n.value ?? n.amount ?? ""),
        status: String(n.status ?? n.judgement ?? ""),
        tone,
      };
    })
    .filter((x: any): x is NonNullable<typeof x> => !!x && !!x.name);

  const warningsSrc = Array.isArray(src.warnings) ? src.warnings : [];
  const warnings = warningsSrc
    .map((w: any) =>
      w
        ? {
            name: String(w.name ?? ""),
            category: String(w.category ?? w.type ?? ""),
            info: String(w.info ?? w.description ?? ""),
          }
        : null,
    )
    .filter((x: any): x is NonNullable<typeof x> => !!x && !!x.name);

  const alternativesSrc = Array.isArray(src.alternatives) ? src.alternatives : [];
  const alternatives = alternativesSrc
    .map((a: any) =>
      a
        ? {
            name: String(a.name ?? ""),
            tagline: String(a.tagline ?? a.subtitle ?? ""),
          }
        : null,
    )
    .filter((x: any): x is NonNullable<typeof x> => !!x && !!x.name);

  return {
    product,
    verdict,
    verdictSub: src.verdictSub ?? src.verdictText ?? undefined,
    coachComment: src.coachComment ?? src.coach ?? src.aiComment ?? undefined,
    nutrition,
    ingredientsRaw: src.ingredientsRaw ?? src.ingredients ?? src.rawIngredients ?? undefined,
    warnings,
    riskCounts: src.riskCounts ?? undefined,
    alternatives,
  };
}
