import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { ChevronRight, LogOut, Trash2 } from "lucide-react";

export const Route = createFileRoute("/my/account")({
  component: Account,
});

function Account() {
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("eatfit.user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.email) setEmail(String(u.email));
      }
    } catch {}
  }, []);

  return (
    <AppShell>
      <TopBar title="계정 설정" />
      <div className="px-5 pt-2 space-y-2">
        <Row label="이메일" value={email || "—"} />
        <Row label="가입일" value="2025.03.14" />
        <Row label="이용약관" linkTo />
        <Row label="개인정보 처리방침" linkTo />
      </div>

      <div className="px-5 mt-8 space-y-2">
        <Link to="/start" className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border">
          <LogOut className="size-4.5 text-muted-foreground" />
          <span className="text-[14px] font-medium flex-1">로그아웃</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive">
          <Trash2 className="size-4.5" />
          <span className="text-[14px] font-medium flex-1 text-left">회원 탈퇴</span>
        </button>
      </div>

      <div className="mt-10 text-center text-[11px] text-muted-foreground pb-10">
        EATFIT 잇핏 v0.1.0
      </div>
    </AppShell>
  );
}

function Row({ label, value, linkTo }: { label: string; value?: string; linkTo?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border">
      <span className="text-[14px] font-medium flex-1">{label}</span>
      {value && <span className="text-[13px] text-muted-foreground">{value}</span>}
      {linkTo && <ChevronRight className="size-4 text-muted-foreground" />}
    </div>
  );
}
