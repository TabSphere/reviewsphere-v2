"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin() {
    setErr("");
    setLoading(true);

    try {
      const supabase = supabaseBrowser;
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 p-10 shadow-lg">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h1>
        <p className="text-sm text-slate-600 font-semibold mb-7">Sign in to ReviewSphere</p>

        {err && (
          <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-3 text-sm font-bold text-red-600 mb-5">
            {err}
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs font-black text-slate-700 block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200/70 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 bg-white/60"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-black text-slate-700 block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-xl border border-slate-200/70 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 bg-white/60"
          />
        </div>

        <Button onClick={handleLogin} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center mt-5 text-xs text-slate-600 font-semibold">
          No account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-black hover:underline"
          >
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
}