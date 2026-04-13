"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserInputs, CarbonScores } from "@/lib/gemini";

interface Props {
  inputs: UserInputs;
  scores: CarbonScores;
}

export default function AIInsights({ inputs, scores }: Props) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setInsights([]);
    setFetched(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs, scores }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI insights.");
      }

      setInsights(data.insights);
      setFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const insightIcons = ["🔍", "💡", "🌱"];
  const insightColors = [
    "border-blue-500/40 bg-blue-500/5",
    "border-yellow-500/40 bg-yellow-500/5",
    "border-emerald-500/40 bg-emerald-500/5",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon/20 border border-neon/40 flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">AI Reality Insights</h2>
          <p className="text-gray-400 text-xs">Powered by Google Gemini</p>
        </div>
      </div>

      {/* Analyze button */}
      <motion.button
        id="analyze-btn"
        onClick={handleAnalyze}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full py-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-3 transition-all duration-200 relative overflow-hidden"
        style={{
          background: loading
            ? "rgba(57,255,20,0.05)"
            : "linear-gradient(135deg, rgba(57,255,20,0.15), rgba(57,255,20,0.05))",
          borderColor: loading ? "rgba(57,255,20,0.3)" : "rgba(57,255,20,0.6)",
          color: "#39ff14",
        }}
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-xl"
            >
              ⚙️
            </motion.span>
            <span>Analyzing with Gemini AI...</span>
          </>
        ) : (
          <>
            <span className="text-xl">✨</span>
            <span>Analyze My Impact</span>
          </>
        )}
      </motion.button>

      {/* Loading shimmer */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-16 rounded-xl bg-white/5 overflow-hidden relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-red-500/40 bg-red-500/10 rounded-xl p-4 text-red-400 text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights */}
      <AnimatePresence>
        {fetched && insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
              🎯 Personalized for You
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className={`rounded-xl p-5 border flex flex-col gap-3 ${insightColors[idx % insightColors.length]}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-lg">
                    {insightIcons[idx % insightIcons.length]}
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed flex-1">
                    • {insight.replace(/^[-*•]\s*/, "")}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Gemini badge */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-gray-500">Generated by Gemini AI</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
