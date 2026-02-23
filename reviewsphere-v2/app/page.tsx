"use client";

import Link from "next/link";
import TestimonialSection from "@/components/layout/TestimonialSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #F8FFFE 0%, #F0F9F6 50%, #F3F4FF 100%)' }}>
      {/* Header */}
      <header className="border-b border-slate-200/30 backdrop-blur-sm sticky top-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-black text-slate-900">ReviewSphere</div>
          <div className="flex gap-2 md:gap-3">
            <Link href="/login" className="px-3 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-white text-xs md:text-sm font-bold hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary to-primary2"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl w-full mx-auto">
          {/* Left text column */}
          <div className="space-y-8 md:space-y-10 max-w-xl text-center lg:text-left relative z-20">
            {/* Badge */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background: 'rgba(0, 191, 166, 0.08)', border: '1px solid rgba(0, 191, 166, 0.2)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--primary, #00BFA6)' }}>AI-POWERED</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight my-6 md:my-8">
                Professional Google review replies,
                <span 
                  className="block bg-clip-text text-transparent relative z-10" 
                  style={{ background: 'linear-gradient(90deg, var(--primary, #141817) 0%, var(--primary2, #5C6AC4) 100%)' }}
                >
                  in seconds
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                Stop spending hours drafting responses. ReviewSphere generates personalized, professional replies powered by AI. Boost your reputation instantly.
              </p>
            </div>
          </div>


        </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-12 md:my-16 pt-4 md:pt-8">
            <div className="p-4 md:p-6 rounded-2xl flex flex-col items-start" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0, 191, 166, 0.1)', backdropFilter: 'blur(8px)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base">Instant Replies</h3>
              <p className="text-xs md:text-sm text-slate-600">Generate professional responses in seconds, not hours.</p>
            </div>
            
            <div className="p-4 md:p-6 rounded-2xl flex flex-col items-start" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(92, 106, 196, 0.1)', backdropFilter: 'blur(8px)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
              <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base">5 Tones</h3>
              <p className="text-xs md:text-sm text-slate-600">Professional, Friendly, Empathetic, Concise, or SEO-optimized.</p>
            </div>
            
            <div className="p-4 md:p-6 rounded-2xl flex flex-col items-start" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0, 191, 166, 0.1)', backdropFilter: 'blur(8px)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" /></svg>
              <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base">Full History</h3>
              <p className="text-xs md:text-sm text-slate-600">Track all replies and manage multiple locations effortlessly.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-8">
            <Link 
              href="/signup" 
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-bold text-sm md:text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              style={{ background: 'linear-gradient(90deg, var(--primary, #00BFA6) 0%, var(--primary2, #5C6AC4) 100%)' }}
            >
              Start free trial
            </Link>
            <Link 
              href="/upgrade" 
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-slate-900 font-bold text-sm md:text-lg hover:bg-slate-100 transition-colors"
              style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.1)' }}
            >
              View pricing
            </Link>
          </div>

          <p className="text-xs md:text-sm text-slate-500 pt-4 md:pt-6">No credit card required - Built for businesses like yours - Cancel anytime</p>
      </main>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Footer */}
      <footer className="border-t border-slate-200/30 py-6 md:py-10 px-4 md:px-6" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
        <div className="max-w-6xl mx-auto text-center text-xs md:text-sm text-slate-600">
          <p>&copy; 2026 ReviewSphere. Trusted by businesses worldwide to manage their online reputation.</p>
        </div>
      </footer>
    </div>
  );
}
