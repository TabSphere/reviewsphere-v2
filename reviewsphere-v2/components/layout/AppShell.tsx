"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function AppShell({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!mounted) return;
      setEmail(data?.session?.user?.email ?? null);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <aside className="w-64 hidden md:block border-r p-4">
        <div className="mb-6">
          <div className="text-lg font-extrabold">ReviewSphere</div>
          <div className="text-xs text-slate-500">Professional reply assistant</div>
        </div>

        <nav className="flex flex-col gap-2 mt-6">
          <a href="#generate" className="px-3 py-2 rounded-md hover:bg-slate-100">Generate</a>
          <a href="#history" className="px-3 py-2 rounded-md hover:bg-slate-100">History</a>
          <a href="#billing" className="px-3 py-2 rounded-md hover:bg-slate-100">Billing</a>
        </nav>

        <div className="mt-auto pt-6">
          <div className="text-xs text-slate-500">Signed in as</div>
          <div className="text-sm font-medium truncate">{email ?? "—"}</div>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden px-2 py-1">Menu</button>
            <div className="text-sm font-semibold">Dashboard</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">{email}</div>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
