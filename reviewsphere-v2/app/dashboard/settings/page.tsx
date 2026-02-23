"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      setProfile(data?.user ?? null);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="rounded-2xl border p-6 bg-white/70 backdrop-blur-md shadow-sm">
      <h2 className="text-2xl font-black mb-3">Settings</h2>
      <p className="text-sm text-slate-600 mb-6">Manage your account, business profile, and connected services.</p>

      <section className="mb-6">
        <h3 className="font-semibold">Account</h3>
        <div className="mt-3 text-sm text-slate-700">Email: {profile?.email ?? '—'}</div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold">Integrations</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button onClick={async () => {
            try {
              const res = await fetch('/api/google/link');
              const json = await res.json();
              if (!res.ok) {
                alert(json.message || json.error || 'Google linking is not configured.');
                return;
              }
              // If backend returns a redirect URL, navigate there
              if (json.url) return window.location.assign(json.url);
              alert('Google linking: ' + (json.message ?? 'Check configuration'));
            } catch (err) {
              console.error(err);
              alert('Unable to reach Google linking endpoint.');
            }
          }}>Link Google Business</Button>

          <Button onClick={async () => {
            try {
              const res = await fetch('/api/google/reviews');
              const json = await res.json();
              if (!res.ok) {
                alert(json.message || json.error || 'Google reviews fetch is not configured.');
                return;
              }
              alert('Pulled reviews: ' + (json.message ?? 'See results in History'));
            } catch (err) {
              console.error(err);
              alert('Unable to reach Google reviews endpoint.');
            }
          }}>Pull reviews now</Button>
        </div>
      </section>
    </div>
  );
}
