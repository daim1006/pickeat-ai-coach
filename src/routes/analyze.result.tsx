import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { AnalysisView } from "@/components/AnalysisView";

export const Route = createFileRoute("/analyze/result")({
  component: Result,
});

function Result() {
  return (
    <AppShell>
      <TopBar title="분석 결과" />
      <AnalysisView />

      <div className="sticky bottom-0 bg-background/95 backdrop-blur px-5 pt-3 pb-6 border-t border-border">
        <div className="flex gap-2">
          <Link
            to="/analyze/saved"
            className="flex-[2] h-14 rounded-2xl bg-primary text-primary-foreground text-[15px] font-semibold grid place-items-center"
          >
            먹었어요
          </Link>
          <Link
            to="/analyze/saved"
            className="flex-1 h-14 rounded-2xl bg-surface border border-border text-[14px] font-medium grid place-items-center"
          >
            저장만 하기
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
