import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { ImagePlus, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scan/upload")({
  component: ScanUpload,
});

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

function ScanUpload() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const picked = !!file;

  // Clear any prior scan/analysis state when entering upload.
  useEffect(() => {
    try {
      sessionStorage.removeItem("analyze.result");
      sessionStorage.removeItem("analyze.error");
      sessionStorage.removeItem("scan.image");
      sessionStorage.removeItem("scan.mimeType");
      sessionStorage.removeItem("scan.filename");
    } catch {
      // ignore
    }
  }, []);

  const onPick = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setError(null);
    try {
      setPreview(await fileToDataUrl(f));
    } catch {
      setPreview(null);
    }
  };

  const onAnalyze = async () => {
    if (!file || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const image = preview ?? (await fileToDataUrl(file));
      if (!image) {
        setError("이미지를 읽을 수 없어요");
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.removeItem("analyze.result");
        sessionStorage.removeItem("analyze.error");
        sessionStorage.setItem("scan.image", image);
        sessionStorage.setItem("scan.mimeType", file.type || "image/jpeg");
        sessionStorage.setItem("scan.filename", file.name || `upload-${Date.now()}.jpg`);
      } catch {
        // ignore storage errors
      }
      navigate({ to: "/analyze/loading" });
    } catch {
      setError("분석 요청을 시작할 수 없어요");
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <TopBar title="이미지 업로드" />
      <div className="flex-1 flex flex-col px-5 pb-8">
        <p className="text-[13px] text-muted-foreground">
          영양성분표와 원재료명이 모두 보이는 이미지가 가장 정확해요
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        <button
          onClick={() => inputRef.current?.click()}
          className={cn(
            "mt-5 aspect-[3/4] w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden",
            picked
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface text-muted-foreground"
          )}
        >
          {picked && preview ? (
            <img src={preview} alt="선택된 이미지" className="size-full object-cover" />
          ) : picked ? (
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
            onClick={() => {
              setFile(null);
              setPreview(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="mt-3 self-start inline-flex items-center gap-1 text-[12px] text-muted-foreground"
          >
            <RotateCcw className="size-3.5" /> 다시 선택
          </button>
        )}

        {error && (
          <p className="mt-3 text-[12px] text-destructive">{error}</p>
        )}

        <div className="flex-1" />
        <button
          onClick={onAnalyze}
          disabled={!picked || submitting}
          className={cn(
            "h-14 rounded-2xl text-base font-semibold grid place-items-center",
            picked && !submitting
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> 분석 중…
            </span>
          ) : (
            "분석하기"
          )}
        </button>
      </div>
    </AppShell>
  );
}
