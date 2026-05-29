import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/my/account")({
  component: Account,
});

function Account() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("eatfit.user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) setName(String(u.name));
        if (u?.email) setEmail(String(u.email));
        if (u?.password) setPassword(String(u.password));
      }
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      const raw = localStorage.getItem("eatfit.user");
      const prev = raw ? JSON.parse(raw) : {};
      const next = { ...prev, name, email, password };
      localStorage.setItem("eatfit.user", JSON.stringify(next));
    } catch {}
    router.history.back();
  };

  return (
    <AppShell>
      <TopBar title="프로필 관리" />
      <div className="px-5 pt-2 space-y-3">
        <Field label="이름" value={name} onChange={setName} />
        <Field label="이메일" value={email} onChange={setEmail} type="email" />
        <Field label="비밀번호" value={password} onChange={setPassword} type="password" />
      </div>

      <div className="px-5 mt-8">
        <button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-[15px] font-semibold"
        >
          저장
        </button>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block p-4 rounded-2xl bg-surface border border-border">
      <div className="text-[11.5px] text-muted-foreground mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none text-[14px] font-medium"
      />
    </label>
  );
}
