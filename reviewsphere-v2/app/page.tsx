"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #F8FFFE 0%, #F0F9F6 50%, #F3F4FF 100%)' }}>
      {/* Header */}
      <header className="border-b border-slate-200/30 backdrop-blur-sm sticky top-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-2xl font-black text-slate-900">ReviewSphere</div>
          <div className="flex gap-3">
            <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 rounded-lg text-white text-sm font-bold hover:shadow-lg transition-all duration-200" 
              style={{ background: 'linear-gradient(90deg, var(--primary, #00BFA6) 0%, var(--primary2, #5C6AC4) 100%)' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background: 'rgba(0, 191, 166, 0.08)', border: '1px solid rgba(0, 191, 166, 0.2)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--primary, #00BFA6)' }}>✨ AI-POWERED</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-tight my-8">
              Professional Google review replies,
              <span 
                className="block bg-clip-text text-transparent" 
                style={{ background: 'linear-gradient(90deg, var(--primary, #00BFA6) 0%, var(--primary2, #5C6AC4) 100%)' }}
              >
                in seconds
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Stop spending hours drafting responses. ReviewSphere generates personalized, professional replies powered by AI. Boost your reputation instantly.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 pt-8">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0, 191, 166, 0.1)', backdropFilter: 'blur(8px)' }}>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Replies</h3>
              <p className="text-sm text-slate-600">Generate professional responses in seconds, not hours.</p>
            </div>
            
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(92, 106, 196, 0.1)', backdropFilter: 'blur(8px)' }}>
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-slate-900 mb-2">5 Tones</h3>
              <p className="text-sm text-slate-600">Professional, Friendly, Empathetic, Concise, or SEO-optimized.</p>
            </div>
            
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0, 191, 166, 0.1)', backdropFilter: 'blur(8px)' }}>
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-slate-900 mb-2">Full History</h3>
              <p className="text-sm text-slate-600">Track all replies and manage multiple locations effortlessly.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/signup" 
              className="px-8 py-4 rounded-xl text-white font-bold text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              style={{ background: 'linear-gradient(90deg, var(--primary, #00BFA6) 0%, var(--primary2, #5C6AC4) 100%)' }}
            >
              Start free trial
            </Link>
            <Link 
              href="/upgrade" 
              className="px-8 py-4 rounded-xl text-slate-900 font-bold text-lg hover:bg-slate-100 transition-colors"
              style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.1)' }}
            >
              View pricing
            </Link>
          </div>

          <p className="text-sm text-slate-500 pt-6">No credit card required • Built for businesses like yours • Cancel anytime</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/30 py-10" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-600">
          <p>&copy; 2026 ReviewSphere. Trusted by businesses worldwide to manage their online reputation.</p>
        </div>
      </footer>
    </div>
  );
}
