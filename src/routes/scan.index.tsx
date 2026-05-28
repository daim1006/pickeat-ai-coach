import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { X, ImageIcon, HelpCircle, Zap } from "lucide-react";

export const Route = createFileRoute("/scan/")({
  component: Scan,
});

function Scan() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="relative flex-1 min-h-screen bg-[#0c0d0f] text-white flex flex-col">
        {/* top bar */}
        <header className="flex items-center justify-between px-4 pt-4 z-10">
          <button onClick={() => navigate({ to: "/home" })} aria-label="닫기" className="size-10 grid place-items-center rounded-full bg-white/10">
            <X className="size-5" />
          </button>
          <Link to="/scan/guide" className="size-10 grid place-items-center rounded-full bg-white/10" aria-label="가이드">
            <HelpCircle className="size-5" />
          </Link>
        </header>

        {/* camera viewport */}
        <div className="flex-1 relative flex items-center justify-center px-6">
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 aspect-[3/4] rounded-3xl overflow-hidden">
            {/* fake camera bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
            {/* corner frame */}
            <Corners />
            <div className="absolute inset-x-0 top-6 text-center text-[13px] font-medium text-white/90">
              영양정보와 원재료명이 잘 보이게 찍어주세요
            </div>
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-full bg-black/40 backdrop-blur">
                <Zap className="size-3" /> 자동 인식 중
              </span>
            </div>
          </div>
        </div>

        {/* controls */}
        <footer className="px-6 pb-10 pt-6 flex items-center justify-between">
          <Link to="/scan/upload" aria-label="갤러리" className="size-12 rounded-2xl bg-white/10 grid place-items-center">
            <ImageIcon className="size-5" />
          </Link>
          <button
            onClick={() => navigate({ to: "/analyze/loading" })}
            aria-label="촬영"
            className="size-20 rounded-full bg-white grid place-items-center active:scale-95 transition-transform"
          >
            <span className="size-16 rounded-full border-4 border-zinc-900" />
          </button>
          <div className="size-12" />
        </footer>
      </div>
    </AppShell>
  );
}

function Corners() {
  const c = "absolute size-8 border-primary";
  return (
    <>
      <div className={`${c} top-4 left-4 border-t-4 border-l-4 rounded-tl-2xl`} />
      <div className={`${c} top-4 right-4 border-t-4 border-r-4 rounded-tr-2xl`} />
      <div className={`${c} bottom-4 left-4 border-b-4 border-l-4 rounded-bl-2xl`} />
      <div className={`${c} bottom-4 right-4 border-b-4 border-r-4 rounded-br-2xl`} />
    </>
  );
}
