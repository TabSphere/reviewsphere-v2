"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [done, setDone]         = useState(false);

  async function handleSignup() {
    setErr(""); setLoading(true);
    const { error } = await supabaseBrowser.auth.signUp({ email, password });
    if (error) { setErr(error.message); setLoading(false); return; }
    setDone(true); setLoading(false);
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 p-10 shadow-lg text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Check your email</h2>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed">
          We sent a confirmation link to <strong>{email}</strong>.<br />
          Click it to activate your account, then sign in.
        </p>
        <Button onClick={() => router.push("/login")} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
          Go to sign in
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 p-10 shadow-lg">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Create account</h1>
        <p className="text-sm text-slate-600 font-semibold mb-7">Start using ReviewSphere free</p>

        {err && <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-3 text-sm font-bold text-red-600 mb-5">{err}</div>}

        <div className="mb-4">
          <label className="text-xs font-black text-slate-700 block mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200/70 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 bg-white/60" />
        </div>

        <div className="mb-6">
          <label className="text-xs font-black text-slate-700 block mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            onKeyDown={e => e.key === "Enter" && handleSignup()}
            className="w-full px-4 py-3 rounded-xl border border-slate-200/70 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 bg-white/60" />
        </div>

        <Button onClick={handleSignup} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
          {loading ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center mt-5 text-xs text-slate-600 font-semibold">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")}
            className="text-blue-600 font-black hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}