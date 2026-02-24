"use client";

import { useState, useEffect } from "react";
import CalmingBubbleGame from "./CalmingBubbleGame";

type Review = {
  id: string;
  reviewer_name: string;
  reviewer_photo_url?: string;
  rating: number;
  review_text: string;
  review_date: string;
  reply_status: string;
  generated_reply?: string;
  reply_tone?: string;
};

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/google/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    } finally {
      setLoading(false);
    }
  };

  const generateReply = async (reviewId: string, reviewText: string, rating: number) => {
    setGenerating(reviewId);
    setShowGame(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_text: reviewText,
          tone: rating >= 4 ? "appreciative" : "empathetic",
        }),
      });

      const data = await res.json();
      if (data.reply) {
        // Update review with generated reply
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, generated_reply: data.reply, reply_status: "awaiting_approval" }
              : r
          )
        );
      }
    } catch (e) {
      console.error("Failed to generate reply", e);
    } finally {
      setGenerating(null);
      setShowGame(false);
    }
  };

  const approveReply = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}/approve`, { method: "POST" });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, reply_status: "approved" } : r))
      );
    } catch (e) {
      console.error("Failed to approve reply", e);
    }
  };

  const rejectReply = async (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, generated_reply: undefined, reply_status: "pending" } : r))
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl border-2 border-slate-200 text-center">
        <div className="inline-flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-teal-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-bold text-slate-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-black text-slate-900 mb-2">No Reviews Yet</h3>
        <p className="text-sm text-slate-600 font-semibold">
          Connect your Google Business account to start pulling reviews automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calming Game - shown during AI generation */}
      {showGame && generating && (
        <div className="animate-subtleFadeUp">
          <div className="mb-3 text-center">
            <h3 className="text-lg font-black text-slate-900 mb-1">AI is crafting your reply... 🤖</h3>
            <p className="text-sm text-slate-600 font-semibold">Relax and pop some bubbles while you wait!</p>
          </div>
          <CalmingBubbleGame isVisible={showGame} />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {/* Review Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                {review.reviewer_photo_url ? (
                  <img
                    src={review.reviewer_photo_url}
                    alt={review.reviewer_name}
                    className="w-12 h-12 rounded-full border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {review.reviewer_name[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-900">{review.reviewer_name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-slate-300"}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {new Date(review.review_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    review.reply_status === "approved"
                      ? "bg-green-100 text-green-700"
                      : review.reply_status === "awaiting_approval"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {review.reply_status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-slate-700 font-medium mb-4 leading-relaxed">{review.review_text}</p>

            {/* Generated Reply */}
            {review.generated_reply && (
              <div className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl border-2 border-teal-200">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>🤖</span> AI-Generated Reply ({review.reply_tone})
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{review.generated_reply}</p>

                {review.reply_status === "awaiting_approval" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => approveReply(review.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      ✓ Approve & Post
                    </button>
                    <button
                      onClick={() => rejectReply(review.id)}
                      className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-300 transition-all"
                    >
                      ✗ Regenerate
                    </button>
                  </div>
                )}

                {review.reply_status === "approved" && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                    <span className="text-sm font-bold text-green-800">✓ Reply posted to Google!</span>
                  </div>
                )}
              </div>
            )}

            {/* Generate Reply Button */}
            {!review.generated_reply && (
              <button
                onClick={() => generateReply(review.id, review.review_text, review.rating)}
                disabled={generating === review.id}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {generating === review.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating Reply...
                  </span>
                ) : (
                  "✨ Generate AI Reply"
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
