"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputForm from "@/components/InputForm";
import EarthVisualizer from "@/components/EarthVisualizer";
import PredictionCard from "@/components/PredictionCard";
import AIInsights from "@/components/AIInsights";
import {
  calculateCarbonScore,
  calculateImprovedScore,
  CarbonScores,
  UserInputs,
} from "@/lib/gemini";

export default function Home() {
  const [inputs, setInputs] = useState<UserInputs>({
    travel: 100,
    travelMode: "car",
    electricity: 150,
    foodType: "veg",
    waterUsage: 135,
  });
  const [scores, setScores] = useState<CarbonScores | null>(null);
  const [improvedTotal, setImprovedTotal] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleSubmit = (newInputs: UserInputs) => {
    const newScores = calculateCarbonScore(newInputs);
    const improved = calculateImprovedScore(newInputs);
    setInputs(newInputs);
    setScores(newScores);
    setImprovedTotal(improved);
    setHasCalculated(true);
  };

  const currentLevel = scores?.level ?? "low";
  const currentScore = scores?.total ?? 0;

  return (
    <main className="min-h-screen bg-space relative overflow-x-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer" />
        {[
          { w: 320, h: 280, l: 10, t: 15, c: "#00e5ff" },
          { w: 250, h: 350, l: 70, t: 60, c: "#3b82f6" },
          { w: 380, h: 200, l: 40, t: 80, c: "#8b5cf6" },
          { w: 200, h: 300, l: 85, t: 25, c: "#00e5ff" },
          { w: 300, h: 260, l: 25, t: 50, c: "#3b82f6" },
          { w: 350, h: 180, l: 55, t: 5, c: "#8b5cf6" },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{
              width: p.w,
              height: p.h,
              left: `${p.l}%`,
              top: `${p.t}%`,
              background: `radial-gradient(circle, ${p.c}, transparent)`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <motion.header
          className="text-center pt-12 pb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon/30 bg-neon/5 mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-neon text-xs font-medium tracking-widest uppercase">
              AI-Powered Carbon Intelligence
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Your Carbon{" "}
            <span className="text-neon neon-text">Footprint</span>
            <br />
            Visualized
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Visualize your environmental impact in real-time. Get AI-powered
            insights. Build a greener future.
          </p>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT: Input form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <InputForm onSubmit={handleSubmit} />
            </div>
          </div>

          {/* CENTER: Earth */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6">
            <motion.div
              className="glass-card rounded-3xl p-8 w-full flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <EarthVisualizer level={currentLevel} score={currentScore} />

              {!hasCalculated && (
                <motion.p
                  className="text-center text-gray-500 text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Fill in your lifestyle data and hit{" "}
                  <span className="text-neon">Calculate </span>to see your
                  Earth&apos;s health
                </motion.p>
              )}
            </motion.div>

            {/* Carbon meter */}
            {hasCalculated && scores && (
              <motion.div
                className="glass-card rounded-2xl p-5 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                  Carbon Index
                </p>
                <div className="relative h-4 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        scores.level === "low"
                          ? "linear-gradient(90deg, #00b4d8, #00e5ff)"
                          : scores.level === "medium"
                            ? "linear-gradient(90deg, #eab308, #f97316)"
                            : "linear-gradient(90deg, #ef4444, #dc2626)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        scores.level === "low"
                          ? "30%"
                          : scores.level === "medium"
                            ? "65%"
                            : "95%",
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>🌱 Clean</span>
                  <span>⚠️ Moderate</span>
                  <span>🔴 Critical</span>
                </div>

                {/* Indian avg comparison */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[11px] text-gray-500">
                    🇮🇳 Indian per-capita avg:{" "}
                    <span className="text-gray-300 font-semibold">~1,900 kg CO₂/year</span>
                    {" • "}Your footprint:{" "}
                    <span className={`font-semibold ${
                      scores.total < 1900 ? "text-emerald-400" : scores.total < 5000 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {scores.total.toLocaleString()} kg
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Predictions */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {hasCalculated && scores ? (
                <PredictionCard scores={scores} improvedTotal={improvedTotal} />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl"
                  >

                  </motion.div>
                  <p className="text-gray-500 text-center text-sm">
                    Your future predictions & breakdown will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI Insights Full Width Bottom */}
        {hasCalculated && scores && (
          <div className="mt-6 w-full">
            <AIInsights inputs={inputs} scores={scores} />
          </div>
        )}

        {/* Footer */}
        <motion.footer
          className="text-center mt-16 text-gray-600 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>
            Carbon Footprint Tracker{" "}
            <span className="text-neon"></span> • Built by
            K Bharath, D Rohan, Rithanya, Adithi, Niranjan, Shanmuga Sundaran
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
