"use client";

import Link from "next/link";
import TestimonialSection from "@/components/layout/TestimonialSection";
import ImageCarousel from "@/components/layout/ImageCarousel";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Full-screen carousel background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <ImageCarousel />
      </div>

      {/* Content overlay with relative positioning */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-slate-200/30 backdrop-blur-md sticky top-0 z-50 bg-white/80 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-lg">⭐</span>
              </div>
              <div className="text-xl md:text-2xl font-black text-slate-900">ReviewSphere</div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link href="/login" className="px-3 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100">
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-white text-xs md:text-sm font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-teal-500 to-indigo-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section - Full Height */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-20">
          <div className="flex flex-col items-center justify-center gap-8 max-w-3xl w-full mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-sm bg-teal-500/20 border border-teal-500/40">
              <span className="text-xs font-bold text-teal-600">AI-POWERED</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg opacity-0 animate-subtle delay-150">
              Professional Google review replies,
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                in seconds
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base md:text-xl text-white font-medium max-w-2xl leading-relaxed drop-shadow-md opacity-0 animate-subtle delay-300">
              Stop spending hours drafting responses. ReviewSphere generates personalized, professional replies powered by AI. Boost your reputation instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-8 opacity-0 animate-subtle delay-500">
              <Link 
                href="/signup" 
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-bold text-sm md:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-teal-500 to-indigo-600"
              >
                Start free trial
              </Link>
              <Link 
                href="/upgrade" 
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-bold text-sm md:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-white/20 backdrop-blur-sm border border-white/40"
              >
                View pricing
              </Link>
            </div>

            <p className="text-xs md:text-sm text-white/80 pt-8 drop-shadow-md">No credit card required • Built for businesses like yours • Cancel anytime</p>
          </div>
        </main>
      </div>

      {/* Features Grid - White background section */}
      <section className="relative z-10 bg-white py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Why ReviewSphere</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to manage reviews and maintain your reputation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-6 rounded-2xl flex flex-col items-start bg-gradient-to-br from-slate-50 to-white shadow-lg border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base">Instant Replies</h3>
              <p className="text-xs md:text-sm text-slate-600">Generate professional responses in seconds, not hours.</p>
            </div>
            
            <div className="p-6 rounded-2xl flex flex-col items-start bg-gradient-to-br from-slate-50 to-white shadow-lg border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
              <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base">5 Tones</h3>
              <p className="text-xs md:text-sm text-slate-600">Professional, Friendly, Empathetic, Concise, or SEO-optimized.</p>
            </div>
            
            <div className="p-6 rounded-2xl flex flex-col items-start bg-gradient-to-br from-slate-50 to-white shadow-lg border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" /></svg>
              <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base">Full History</h3>
              <p className="text-xs md:text-sm text-slate-600">Track all replies and manage multiple locations effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="relative z-10">
        <TestimonialSection />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/30 py-6 md:py-10 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center text-xs md:text-sm text-slate-600">
          <p>&copy; 2026 ReviewSphere. Trusted by businesses worldwide to manage their online reputation.</p>
        </div>
      </footer>
    </div>
  );
}
