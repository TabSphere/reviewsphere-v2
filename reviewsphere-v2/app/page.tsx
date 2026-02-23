"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black text-slate-900">ReviewSphere</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2 text-sm font-bold text-slate-700 hover:text-slate-900">
              Sign in
            </Link>
            <Link href="/signup" className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg transition-shadow">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 border border-blue-200/50 mb-6">
              <span className="text-sm font-bold text-blue-700">✨ AI-Powered Reviews</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
              Generate professional Google review replies
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> in seconds</span>
            </h1>
            
            <p className="text-xl text-slate-600 font-semibold max-w-2xl mx-auto leading-relaxed">
              ReviewSphere helps businesses respond to customer reviews with AI-generated, professional replies. Save time, maintain consistency, and boost your online reputation.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 pt-8">
            <div className="bg-white/60 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 text-left">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Replies</h3>
              <p className="text-sm text-slate-600">Generate thoughtful responses in seconds, not hours.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 text-left">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-slate-900 mb-2">5 Reply Tones</h3>
              <p className="text-sm text-slate-600">Professional, Friendly, Empathetic, Concise, or SEO-optimized.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 text-left">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-slate-900 mb-2">Track Everything</h3>
              <p className="text-sm text-slate-600">View your reply history and manage multiple locations.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/signup" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-xl transition-shadow"
            >
              Start free trial
            </Link>
            <Link 
              href="/upgrade" 
              className="px-8 py-4 rounded-xl bg-white/80 border border-slate-200/70 text-slate-900 font-bold text-lg hover:bg-white transition-colors"
            >
              View pricing
            </Link>
          </div>

          <p className="text-sm text-slate-500 pt-4">No credit card required • Free tier available • Cancel anytime</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-600">
          <p>&copy; 2026 ReviewSphere. Helping businesses manage their online reputation.</p>
        </div>
      </footer>
    </div>
  );
}
