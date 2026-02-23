"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function OnboardingGuide({ profile }: { profile: any | null }) {
  const skip = async () => {
    try {
      const { data } = (await (await import("@/lib/supabase/client")).supabaseBrowser.auth.getSession()) as any;
      const token = data?.session?.access_token;
      await fetch("/api/profile/onboard", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      // reload to reflect change
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Unable to mark onboarding complete");
    }
  };

  if (!profile || profile.onboarding_complete) return null;

  return (
    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-white/70 to-teal-50/50 border border-teal-200/40 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h4 className="text-lg font-black text-slate-900">Welcome to your dashboard</h4>
          <p className="mt-2 text-sm text-slate-600">Set up your profile, upload a logo, and link Google Business to pull reviews. You can skip this and finish later.</p>

          <ul className="mt-3 text-sm text-slate-700 space-y-2">
            <li>• Upload your logo so generated replies use your brand.</li>
            <li>• Add your business name for better personalization.</li>
            <li>• Link Google Business to import real reviews.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => window.location.assign('/dashboard#overview')} className="px-4 py-2">Get started</Button>
          <Button variant="ghost" onClick={skip} className="px-4 py-2">Skip for now</Button>
        </div>
      </div>
    </div>
  );
}
