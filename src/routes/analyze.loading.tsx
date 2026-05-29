import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";

export const Route = createFileRoute("/analyze/loading")({
  component: Loading,
});

function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();
    const MIN_MS = 1200;
    const MAX_MS = 30_000;

    const tick = () => {
      if (cancelled) return;
      let hasResult = false;
      try {
        hasResult = !!sessionStorage.getItem("analyze.result");
      } catch {
        hasResult = false;
      }
      const elapsed = Date.now() - start;
      if (hasResult && elapsed >= MIN_MS) {
        navigate({ to: "/analyze/result" });
        return;
      }
      if (elapsed >= MAX_MS) {
        toast.error("분석에 시간이 너무 오래 걸려요. 다시 시도해 주세요.");
        navigate({ to: "/scan" });
        return;
      }
      setTimeout(tick, 200);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-gradient-to-b from-primary-soft/50 to-background">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
          <Mascot size={120} className="relative" />
        </div>

        <div className="mt-10 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        <h2 className="mt-8 text-[20px] font-extrabold tracking-tight">
          잇핏이 성분표를<br />분석하고 있어요
        </h2>
        <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">
          영양성분과 원재료명을<br />함께 확인하는 중이에요
        </p>
      </div>
    </AppShell>
  );
}
