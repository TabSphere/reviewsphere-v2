"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Check: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Crown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l4 4 5-7 5 7 4-4v13H3V7z"/>
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
      <line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.88 5.76a2 2 0 0 0 1.36 1.36L21 12l-5.76 1.88a2 2 0 0 0-1.36 1.36L12 21l-1.88-5.76a2 2 0 0 0-1.36-1.36L3 12l5.76-1.88a2 2 0 0 0 1.36-1.36L12 3z"/>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

// ─── Plans ────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    key:         "starter",
    name:        "Starter",
    price:       19,
    credits:     50,
    description: "Perfect for single-location businesses just getting started.",
    icon:        <Icon.Star />,
    accent:      "#5B6CFF",
    light:       "rgba(91,108,255,0.08)",
    features: [
      "50 reply generations / month",
      "1 business location",
      "All 5 reply tones",
      "Reply history (last 10)",
      "Email support",
    ],
    popular: false,
  },
  {
    key:         "pro",
    name:        "Pro",
    price:       49,
    credits:     300,
    description: "For growing businesses that need more volume and control.",
    icon:        <Icon.Zap />,
    accent:      "#8B5CF6",
    light:       "rgba(139,92,246,0.08)",
    features: [
      "300 reply generations / month",
      "Up to 3 business locations",
      "All 5 reply tones",
      "Full reply history",
      "Brand voice customisation",
      "Priority email support",
    ],
    popular: true,
  },
  // Agency plan removed — only Starter and Pro are offered now
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function UpgradePage() {
  const router  = useRouter();
  const [loading, setLoading] = useState<string>("");  // key of plan being loaded
  const [err, setErr]         = useState("");
  const [planConfig, setPlanConfig] = useState<Record<string, boolean> | null>(null);

  async function handleUpgrade(planKey: string) {
    setErr("");
    setLoading(planKey);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { router.push("/login"); return; }

      const res  = await fetch("/api/stripe/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ plan: planKey }),
      });
      const json = await res.json();

      if (!res.ok || !json.url) {
        setErr(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = json.url;
    } catch {
      setErr("Network error. Please check your connection.");
    } finally {
      setLoading("");
    }
  }

  async function handleManageBilling() {
    setErr("");
    setLoading("portal");
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { router.push("/login"); return; }

      const res  = await fetch("/api/stripe/portal", {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok || !json.url) {
        setErr(json.error ?? "Could not open billing portal.");
        return;
      }

      window.location.href = json.url;
    } catch {
      setErr("Network error. Please check your connection.");
    } finally {
      setLoading("");
    }
  }

  // Fetch which plans are actually configured (have Stripe price IDs)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stripe/config');
        if (!res.ok) return setPlanConfig({});
        const json = await res.json();
        setPlanConfig(json);
      } catch (e) {
        setPlanConfig({});
      }
    })();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        :root {
          --bg0: #F6FFFB;
          --bg1: #F0FFF9;
          --stroke: rgba(220,237,230,0.70);
          --text: #042027;
          --muted: #35615A;
          --primary: #00BFA6; /* teal */
          --primary2: #5C6AC4; /* indigo */
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-font-smoothing: antialiased; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background:
            radial-gradient(1200px 700px at 25% 0%, rgba(0,191,166,0.12), transparent 55%),
            radial-gradient(1200px 700px at 85% 10%, rgba(92,106,196,0.10), transparent 50%),
            linear-gradient(135deg, var(--bg0) 0%, var(--bg1) 60%, #FCFFFE 100%);
          color: var(--text);
          min-height: 100vh;
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

        .up-page  { max-width:1100px; margin:0 auto; padding:60px 28px 100px; display:flex; flex-direction:column; align-items:center; width:100%; }

        /* Back */
        .up-back {
          display:inline-flex; align-items:center; gap:7px;
          font-size:13px; font-weight:700; color:var(--muted);
          background:none; border:none; cursor:pointer;
          padding:0; margin-bottom:48px;
          transition:color 0.13s;
          align-self:flex-start;
        }
        .up-back:hover { color:var(--text); }

        /* Hero */
        .up-hero { text-align:center; margin-bottom:56px; animation:fadeUp 0.45s ease both; }
        .up-hero-badge {
          display:inline-flex; align-items:center; gap:7px;
          padding:7px 16px; border-radius:999px;
          background:rgba(91,108,255,0.10); border:1px solid rgba(91,108,255,0.22);
          font-size:12px; font-weight:800; color:var(--primary);
          letter-spacing:0.05em; text-transform:uppercase; margin-bottom:20px;
        }
        .up-hero-title {
          font-size:48px; font-weight:900; letter-spacing:-1.5px; line-height:1.05;
          background:linear-gradient(135deg, #0F172A 0%, var(--primary) 60%, var(--primary2) 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          margin-bottom:14px;
        }
        .up-hero-sub { font-size:18px; color:var(--muted); font-weight:600; max-width:520px; margin:0 auto; line-height:1.55; }

        /* Trust row */
        .up-trust {
          display:flex; align-items:center; justify-content:center; gap:24px;
          margin-top:28px; flex-wrap:wrap;
        }
        .up-trust-item {
          display:flex; align-items:center; gap:6px;
          font-size:12px; font-weight:700; color:var(--muted);
        }
        .up-trust-item svg { color:var(--primary); }

        /* Grid */
        .up-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; animation:fadeUp 0.45s 0.1s ease both; max-width:900px; margin:0 auto; width:100%; }

        .up-card {
          background:rgba(255,255,255,0.72);
          backdrop-filter:blur(12px);
          border:1px solid var(--stroke);
          border-radius:28px; padding:30px;
          position:relative; overflow:hidden;
          transition:transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          display:flex; flex-direction:column;
        }
        .up-card:hover { transform:translateY(-4px); box-shadow:0 24px 70px rgba(0,0,0,0.09); }
        .up-card.popular {
          border-color:rgba(91,108,255,0.35);
          box-shadow:0 0 0 4px rgba(91,108,255,0.08), 0 20px 60px rgba(91,108,255,0.14);
        }
        .up-popular-tag {
          position:absolute; top:20px; right:20px;
          background:linear-gradient(135deg, var(--primary), var(--primary2));
          color:#fff; font-size:10px; font-weight:900;
          letter-spacing:0.08em; text-transform:uppercase;
          padding:5px 12px; border-radius:999px;
          box-shadow:0 6px 18px rgba(91,108,255,0.28);
        }

        .up-plan-icon {
          width:46px; height:46px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:16px; flex-shrink:0;
        }
        .up-plan-icon svg { width:22px; height:22px; }

        .up-plan-name    { font-size:22px; font-weight:900; color:var(--text); letter-spacing:-0.4px; }
        .up-plan-desc    { font-size:13px; color:var(--muted); font-weight:600; margin-top:6px; line-height:1.5; }
        .up-plan-price   { display:flex; align-items:baseline; gap:4px; margin:22px 0 6px; }
        .up-price-pound  { font-size:22px; font-weight:900; color:var(--text); }
        .up-price-num    { font-size:48px; font-weight:900; letter-spacing:-2px; line-height:1; color:var(--text); }
        .up-price-period { font-size:14px; color:var(--muted); font-weight:700; margin-left:2px; }
        .up-credits-badge {
          display:inline-flex; align-items:center; gap:6px;
          font-size:12px; font-weight:800; margin-bottom:24px;
          padding:5px 12px; border-radius:999px; border:1px solid;
        }
        .up-divider { height:1px; background:var(--stroke); margin-bottom:22px; }

        .up-features     { display:flex; flex-direction:column; gap:10px; flex:1; }
        .up-feature      { display:flex; align-items:flex-start; gap:10px; font-size:13px; font-weight:700; color:#374151; line-height:1.4; }
        .up-feature-icon { flex-shrink:0; margin-top:1px; }

        .up-btn {
          margin-top:28px; width:100%;
          display:flex; align-items:center; justify-content:center; gap:8px;
          border:none; border-radius:16px; padding:15px;
          font-family:inherit; font-size:14px; font-weight:900;
          cursor:pointer; transition:transform 0.16s, box-shadow 0.16s, opacity 0.16s;
          letter-spacing:0.01em;
        }
        .up-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .up-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none; }
        .up-btn.primary {
          background:linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%);
          color:#fff; box-shadow:0 12px 36px rgba(91,108,255,0.24);
        }
        .up-btn.primary:hover:not(:disabled) { box-shadow:0 16px 48px rgba(91,108,255,0.32); }
        .up-btn.secondary {
          background:rgba(255,255,255,0.65);
          color:var(--text); border:1.5px solid var(--stroke);
        }
        .up-btn.secondary:hover:not(:disabled) { background:rgba(255,255,255,0.9); border-color:rgba(91,108,255,0.25); }

        .up-spin {
          display:inline-block; width:15px; height:15px; border-radius:50%;
          border:2px solid rgba(255,255,255,0.35); border-top-color:#fff;
          animation:spin 0.65s linear infinite; flex-shrink:0;
        }
        .up-spin.dark { border-color:rgba(0,0,0,0.12); border-top-color:var(--primary); }

        /* Error */
        .up-err {
          display:flex; align-items:center; gap:10px;
          background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22);
          border-radius:16px; padding:14px 18px;
          font-size:14px; color:#DC2626; font-weight:800;
          margin-bottom:28px; max-width:700px; margin-left:auto; margin-right:auto;
          animation:fadeUp 0.3s ease both;
        }

        /* Manage billing */
        .up-manage {
          text-align:center; margin-top:36px;
          font-size:13px; color:var(--muted); font-weight:700;
        }
        .up-manage-btn {
          background:none; border:none; color:var(--primary);
          font-family:inherit; font-size:13px; font-weight:800;
          cursor:pointer; text-decoration:underline; text-underline-offset:3px;
          transition:opacity 0.13s;
        }
        .up-manage-btn:hover { opacity:0.7; }

        @media (max-width:900px) {
          .up-grid { grid-template-columns:1fr; max-width:480px; margin:0 auto; width:100%; }
          .up-hero-title { font-size:34px; }
        }
      `}</style>

      <div className="up-page">
        {/* Back */}
        <button className="up-back" onClick={() => router.push("/dashboard")}>
          <Icon.ArrowLeft /> Back to dashboard
        </button>

        {/* Hero */}
        <div className="up-hero">
          <div className="up-hero-badge"><Icon.Crown /> Upgrade ReviewSphere</div>
          <h1 className="up-hero-title">Simple, transparent pricing</h1>
          <p className="up-hero-sub">
            Generate professional Google review replies at scale.<br />
            Cancel or change plan any time.
          </p>
          <div className="up-trust">
            <span className="up-trust-item"><Icon.Shield /> No contracts</span>
            <span className="up-trust-item"><Icon.Sparkles /> Cancel anytime</span>
            <span className="up-trust-item"><Icon.Check /> VAT invoices included</span>
          </div>
        </div>

        {/* Error */}
        {err && <div className="up-err">⚠ {err}</div>}

        {/* Plan cards */}
        <div className="up-grid">
          {PLANS.map(plan => (
            <div key={plan.key} className={`up-card${plan.popular ? " popular" : ""}`}>
              {plan.popular && <span className="up-popular-tag">Most popular</span>}

              <div className="up-plan-icon" style={{ background: plan.light, color: plan.accent }}>
                {plan.icon}
              </div>

              <p className="up-plan-name">{plan.name}</p>
              <p className="up-plan-desc">{plan.description}</p>

              <div className="up-plan-price">
                <span className="up-price-pound">£</span>
                <span className="up-price-num">{plan.price}</span>
                <span className="up-price-period">/mo</span>
              </div>

              <div
                className="up-credits-badge"
                style={{ background: plan.light, color: plan.accent, borderColor: plan.accent + "30" }}
              >
                <Icon.Sparkles /> {plan.credits.toLocaleString()} generations / month
              </div>

              <div className="up-divider" />

              <ul className="up-features">
                {plan.features.map(f => (
                  <li key={f} className="up-feature">
                    <span className="up-feature-icon" style={{ color: plan.accent }}><Icon.Check /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`up-btn${plan.popular ? " primary" : " secondary"}`}
                onClick={() => handleUpgrade(plan.key)}
                disabled={loading === plan.key || !!(planConfig && !planConfig[plan.key])}
                title={!!(planConfig && !planConfig[plan.key]) ? 'Pricing not configured' : undefined}
              >
                {loading === plan.key
                  ? <><span className={`up-spin${plan.popular ? "" : " dark"}`} /> Processing…</>
                  : (!!(planConfig && !planConfig[plan.key]) ? 'Unavailable' : `Get ${plan.name} — £${plan.price}/mo`)
                }
              </button>
            </div>
          ))}
        </div>

        {/* Manage billing */}
        <p className="up-manage">
          Already subscribed?{" "}
          <button
            className="up-manage-btn"
            onClick={handleManageBilling}
            disabled={loading === "portal"}
          >
            {loading === "portal" ? "Opening…" : "Manage billing & invoices"}
          </button>
        </p>
      </div>
    </>
  );
}
