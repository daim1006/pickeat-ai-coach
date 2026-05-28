import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { ChevronRight, Crown, Target, Filter, Ban, Bell, Settings, User } from "lucide-react";

export const Route = createFileRoute("/my/")({
  component: My,
});

const RESTRICTED_KEY = "onboarding.restricted";

function My() {
  const [restrictedCount, setRestrictedCount] = useState(0);
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(RESTRICTED_KEY);
        if (!raw) return setRestrictedCount(0);
        const p = JSON.parse(raw);
        const sel: string[] = Array.isArray(p.sel) ? p.sel : [];
        const custom: string[] = Array.isArray(p.custom) ? p.custom : [];
        setRestrictedCount(new Set([...sel, ...custom]).size);
      } catch {
        setRestrictedCount(0);
      }
    };
    read();
    window.addEventListener("focus", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("focus", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const settings = [
    { to: "/my/goal", icon: Target, label: "건강 목표", desc: "체중 관리" },
    { to: "/my/focus", icon: Filter, label: "집중 관리 성분", desc: "당, 나트륨 외 1개" },
    { to: "/my/restricted", icon: Ban, label: "피해야 할 성분", desc: restrictedCount === 0 ? "없음" : `${restrictedCount}개` },
    { to: "/my/subscription", icon: Crown, label: "구독 관리", desc: "Free 플랜" },
    { to: "/my/notifications", icon: Bell, label: "알림 설정", desc: "" },
    { to: "/my/account", icon: Settings, label: "계정 설정", desc: "" },
  ] as const;

  return (
    <AppShell withBottomNav>
      <header className="px-5 pt-5">
        <h1 className="text-[22px] font-extrabold tracking-tight">마이</h1>
      </header>

      <section className="mx-5 mt-4 p-5 rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-full bg-white/20 grid place-items-center">
            <User className="size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-bold">다임님</div>
            <div className="text-[12px] opacity-90">30대 · 체중 관리 중</div>
          </div>
          <Link to="/my/subscription" className="text-[11.5px] font-semibold bg-white/20 px-3 py-1.5 rounded-full">
            업그레이드
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat n="42" l="스캔" />
          <Stat n="28" l="저장" />
          <Stat n="14" l="대체 추천" />
        </div>
      </section>

      <ul className="px-5 mt-5 space-y-2 pb-6">
        {settings.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.to}>
              <Link to={s.to} className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border active:bg-muted/40">
                <div className="size-10 rounded-xl bg-muted grid place-items-center text-foreground">
                  <Icon className="size-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold">{s.label}</div>
                  {s.desc && <div className="text-[11.5px] text-muted-foreground mt-0.5">{s.desc}</div>}
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
      <BottomNav />
    </AppShell>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-white/15 rounded-2xl py-2.5">
      <div className="text-[18px] font-extrabold">{n}</div>
      <div className="text-[10.5px] opacity-90">{l}</div>
    </div>
  );
}
