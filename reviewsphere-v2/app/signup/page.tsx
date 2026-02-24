"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import ImageCarousel from "@/components/layout/ImageCarousel";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [done, setDone]         = useState(false);

  async function handleSignup() {
    setErr(""); setLoading(true);
    try {
      const { data, error } = await supabaseBrowser.auth.signUp({ email, password });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }

      // If Supabase returned the user immediately (no email confirmation flow),
      // create a profiles row so the dashboard shows account data.
      const user = (data as any)?.user;
      if (user?.id) {
        try {
          await supabaseBrowser.from('profiles').insert({ id: user.id, email }).throwOnError();
        } catch (e) {
          // Non-fatal: profile can be created later on first sign-in.
          console.warn('Failed to create profile automatically', e);
        }
      }

      setDone(true);
    } catch (e: any) {
      setErr(e?.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="fixed inset-0 z-0">
        <ImageCarousel />
      </div>

      {/* Success Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl text-center animate-subtleFadeUp">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-teal-500 mb-6 shadow-lg">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3">Check your email</h2>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed mb-8">
            We sent a confirmation link to <strong className="text-slate-900">{email}</strong>.<br />
            Click it to activate your account, then sign in.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Go to sign in
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="fixed inset-0 z-0">
        <ImageCarousel />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl animate-subtleFadeUp">
          {/* Logo/Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 mb-4 shadow-lg">
              <span className="text-3xl">⭐</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create account</h1>
            <p className="text-sm text-slate-600 font-semibold">Start using ReviewSphere free</p>
          </div>

          {err && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-semibold text-red-600 mb-6 animate-subtleFadeUp">
              {err}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 bg-white shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                onKeyDown={e => e.key === "Enter" && handleSignup()}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600 font-semibold">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-teal-600 font-black hover:text-indigo-600 transition-colors duration-200 underline decoration-2 underline-offset-2"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}