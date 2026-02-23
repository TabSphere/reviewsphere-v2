"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function Header({ email }: { email?: string | null }) {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    // After sign out, send user to the public landing page
    router.push('/');
  }

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-slate-200/50 bg-white/40 backdrop-blur-md sticky top-0 z-40">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Dashboard</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">Manage your review replies</p>
      </div>

      <div className="flex items-center gap-4">
        {email && <div className="px-4 py-2 rounded-lg bg-white/60 border border-slate-200/50 text-sm font-semibold text-slate-700">{email.split('@')[0]}</div>}
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Sign out</Button>
      </div>
    </header>
  );
}
