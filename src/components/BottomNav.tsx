import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, ClipboardList, MessageCircle, User, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "홈", icon: Home },
  { to: "/history", label: "기록", icon: ClipboardList },
  { to: "/chat", label: "챗봇", icon: MessageCircle },
  { to: "/my", label: "마이", icon: User },
] as const;

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40">
      <div className="relative">
        {/* Floating scan button */}
        <button
          onClick={() => navigate({ to: "/scan" })}
          aria-label="스캔하기"
          className="absolute left-1/2 -translate-x-1/2 -top-7 size-16 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-float)] active:scale-95 transition-transform"
        >
          <ScanLine className="size-7" strokeWidth={2.4} />
        </button>

        <div className="bg-surface/95 backdrop-blur border-t border-border safe-bottom">
          <ul className="grid grid-cols-5 h-16 items-center">
            {tabs.slice(0, 2).map((t) => (
              <NavItem key={t.to} {...t} active={path.startsWith(t.to)} />
            ))}
            <li aria-hidden className="h-full" />
            {tabs.slice(2).map((t) => (
              <NavItem key={t.to} {...t} active={path.startsWith(t.to)} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <li className="h-full">
      <Link
        to={to}
        className={cn(
          "flex flex-col items-center justify-center gap-1 h-full text-[11px] font-medium transition-colors",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <Icon className={cn("size-5", active && "text-primary")} strokeWidth={active ? 2.4 : 2} />
        <span>{label}</span>
      </Link>
    </li>
  );
}
