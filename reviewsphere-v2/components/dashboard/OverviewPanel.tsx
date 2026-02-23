"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import OnboardingGuide from "@/components/dashboard/OnboardingGuide";

export default function OverviewPanel({ profile }: { profile: any | null }) {
  const [logoUrl, setLogoUrl] = useState<string | null>((profile && profile.logo_url) ?? null);
  const [uploading, setUploading] = useState(false);
  const [businessName, setBusinessName] = useState(profile?.business_name ?? "");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const filePath = `logos/${profile?.id ?? 'anon'}-${Date.now()}-${file.name}`;
      const { data, error } = await supabaseBrowser.storage.from('logos').upload(filePath, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = await supabaseBrowser.storage.from('logos').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      // Save to profile (best-effort)
      await fetch('/api/profile/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logo_url: publicUrl, business_name: businessName }) });
      setLogoUrl(publicUrl);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Ensure a storage bucket named "logos" exists and SUPABASE keys are configured.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 p-4 md:p-6 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/80 flex items-center justify-center overflow-hidden border border-slate-200/60 flex-shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Business logo" className="object-cover w-full h-full" />
            ) : (
              <div className="text-xs md:text-sm text-slate-500 font-medium">No logo</div>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-base md:text-lg font-black text-slate-900 truncate">{businessName || profile?.full_name || profile?.email || 'Your business'}</div>
            <div className="text-xs md:text-sm text-slate-600 mt-1">{profile?.plan ?? 'Starter'} plan • {profile?.credits_balance ?? 0} credits</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 w-full md:w-auto">
          <label className="flex-1 sm:flex-none">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <Button className="px-3 md:px-4 py-2 text-xs md:text-sm w-full sm:w-auto">{uploading ? 'Uploading...' : 'Upload logo'}</Button>
          </label>
          <Button onClick={() => window.location.assign('/upgrade')} className="px-3 md:px-4 py-2 text-xs md:text-sm flex-1 sm:flex-none">Upgrade plan</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Business name</label>
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200/60 bg-white/60 text-sm" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-600">Google Business</div>
          <div className="mt-2">
            <Button onClick={async () => {
              try {
                const res = await fetch('/api/google/link');
                const json = await res.json();
                if (!res.ok) {
                  alert(json.message || json.error || 'Google linking is not configured.');
                  return;
                }
                if (json.url) return window.location.assign(json.url);
                alert('Google linking: ' + (json.message ?? 'Check configuration'));
              } catch (err) {
                console.error(err);
                alert('Unable to reach Google linking endpoint.');
              }
            }} className="w-full">Link Google Business</Button>
            <div className="text-xs text-slate-500 mt-2">Linking enables pulling live reviews for reply generation.</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <OnboardingGuide profile={profile} />
      </div>
    </div>
  );
}
