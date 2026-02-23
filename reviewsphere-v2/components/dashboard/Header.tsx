"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function Header({ email }: { email?: string | null }) {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push('/login');
  }

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-slate-200 bg-[var(--background)]">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">{email}</div>
        <Button variant="ghost" onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}
