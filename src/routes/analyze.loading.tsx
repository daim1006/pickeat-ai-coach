import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { scanFood, N8nError } from "@/lib/n8n";

export const Route = createFileRoute("/analyze/loading")({
  component: Loading,
});

const FAIL_MSG = "분석에 실패했어요. 다시 시도해주세요";

function Loading() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    try {
      sessionStorage.removeItem("analyze.result");
      sessionStorage.removeItem("analyze.error");
    } catch {
      // ignore
    }

    const read = (k: string) => {
      try { return sessionStorage.getItem(k); } catch { return null; }
    };
    const nutritionImg = read("scan.image.nutrition");
    const ingredientsImg = read("scan.image.ingredients");

    if (!nutritionImg || !ingredientsImg) {
      setErrorMsg(FAIL_MSG);
      toast.error(FAIL_MSG);
      return;
    }

    let userHealthGoal = "";
    try {
      const raw = localStorage.getItem("onboarding.healthGoal");
      if (raw) {
        const parsed = JSON.parse(raw);
        userHealthGoal = parsed?.label ?? parsed?.id ?? "";
      }
    } catch {
      // ignore
    }

    (async () => {
      try {
        const result = await scanFood({
          image_nutrition: nutritionImg,
          image_ingredients: ingredientsImg,
          user_health_goal: userHealthGoal,
        });
        if (!result || result.success === false) {
          setErrorMsg(FAIL_MSG);
          toast.error(FAIL_MSG);
          try { sessionStorage.setItem("analyze.error", FAIL_MSG); } catch {}
          return;
        }
        try {
          sessionStorage.setItem("analyze.result", JSON.stringify(result));
        } catch {
          // ignore
        }
        navigate({ to: "/analyze/result" });
      } catch (e) {
        const msg = FAIL_MSG;
        try { sessionStorage.setItem("analyze.error", msg); } catch {}
        setErrorMsg(msg);
        toast.error(msg);
        void e;
      }
    })();
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

        {errorMsg && (
          <div className="mt-6 space-y-3">
            <p className="text-[13px] text-destructive">{errorMsg}</p>
            <button
              onClick={() => navigate({ to: "/scan" })}
              className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold"
            >
              다시 촬영하기
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
