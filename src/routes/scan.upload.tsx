import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { ImagePlus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scan/upload")({
  component: ScanUpload,
});

function ScanUpload() {
  const [picked, setPicked] = useState(false);
  return (
    <AppShell>
      <TopBar title="이미지 업로드" />
      <div className="flex-1 flex flex-col px-5 pb-8">
        <p className="text-[13px] text-muted-foreground">
          영양성분표와 원재료명이 모두 보이는 이미지가 가장 정확해요
        </p>

        <button
          onClick={() => setPicked(true)}
          className={cn(
            "mt-5 aspect-[3/4] w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
            picked
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface text-muted-foreground"
          )}
        >
          {picked ? (
            <div className="size-full rounded-3xl bg-gradient-to-br from-zinc-200 to-zinc-400 grid place-items-center text-zinc-600 font-semibold">
              선택된 이미지 미리보기
            </div>
          ) : (
            <>
              <ImagePlus className="size-10" />
              <span className="text-[13px] font-medium">이미지 선택하기</span>
            </>
          )}
        </button>

        {picked && (
          <button
            onClick={() => setPicked(false)}
            className="mt-3 self-start inline-flex items-center gap-1 text-[12px] text-muted-foreground"
          >
            <RotateCcw className="size-3.5" /> 다시 선택
          </button>
        )}

        <div className="flex-1" />
        <Link
          to="/analyze/loading"
          aria-disabled={!picked}
          className={cn(
            "h-14 rounded-2xl text-base font-semibold grid place-items-center",
            picked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground pointer-events-none"
          )}
        >
          분석하기
        </Link>
      </div>
    </AppShell>
  );
}
