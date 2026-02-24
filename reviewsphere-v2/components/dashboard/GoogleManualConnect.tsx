"use client";

import { useState } from "react";
import Button from "../ui/Button";

export default function GoogleManualConnect() {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      setError("Please paste a Google access token");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/google/manual-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to connect");
        return;
      }

      setSuccess(true);
      setAccessToken("");
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
    <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-900 mb-2">Manual Google Connection</h3>
          <p className="text-sm text-slate-600 font-semibold mb-4">
            Having OAuth troubles? Paste your Google access token directly to connect your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✅ Success! Redirecting to dashboard...
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Google Access Token
              </label>
              <textarea
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste your access token here..."
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
                rows={4}
              />
            </div>

            <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 p-3 rounded">
              <strong>How to get your access token:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>
                  Go to{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener"
                    className="text-blue-600 hover:underline"
                  >
                    Google Account Permissions
                  </a>
                </li>
                <li>Or use Google's OAuth Playground: <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener" className="text-blue-600 hover:underline">oauthplayground.com</a></li>
                <li>Make sure to request: <code className="bg-white px-1 rounded text-xs">business.manage</code> scope</li>
              </ol>
            </div>

            <Button
              onClick={handleConnect}
              disabled={loading || !accessToken.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Connect with Token"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
