"use client";

import { useState } from "react";
import Button from "../ui/Button";

export default function GoogleDemoConnect() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleDemoMode = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/google/demo-connect", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to enable demo mode");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
            <span className="text-2xl">🎬</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-900 mb-2">Demo Mode (Test the System)</h3>
            <p className="text-sm text-slate-600 font-semibold mb-4">
              Can't wait for OAuth setup? Enable demo mode to test the entire review management system with sample data. You can upgrade to real data later.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                ✅ Demo mode enabled! Loading dashboard...
              </div>
            )}

            <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 p-3 rounded mb-4">
              <strong>What you get in demo mode:</strong>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>3 sample Google reviews to manage</li>
                <li>Full AI reply generation (powered by OpenAI)</li>
                <li>Approval workflow testing</li>
                <li>Calming game while AI generates replies</li>
                <li>Real data persistence to your database</li>
              </ul>
            </div>

            <Button
              onClick={handleDemoMode}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50"
            >
              {loading ? "Enabling Demo Mode..." : "Enable Demo Mode"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <strong>After you test:</strong> Go back to Google Cloud Console and properly register <code className="bg-white px-1.5 py-0.5 rounded">http://localhost:3001/api/google/callback</code> as an authorized redirect URI. Make sure it's in the correct OAuth 2.0 Client ID (not a Service Account).
      </div>
    </div>
  );
}
