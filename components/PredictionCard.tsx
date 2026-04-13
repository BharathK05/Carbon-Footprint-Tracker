"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { CarbonScores } from "@/lib/gemini";

interface Props {
  scores: CarbonScores;
  improvedTotal: number;
}

function BreakdownBar({
  label,
  value,
  total,
  color,
  icon,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: string;
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400 flex items-center gap-1">
          <span>{icon}</span> {label}
        </span>
        <span className="text-white font-semibold">{value.toLocaleString()} kg</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function PredictionCard({ scores, improvedTotal }: Props) {
  const reduction = scores.total - improvedTotal;
  const reductionPct = scores.total > 0 ? Math.round((reduction / scores.total) * 100) : 0;

  const levelConfig = {
    low: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: "🟢" },
    medium: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", icon: "🟡" },
    high: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: "🔴" },
  };
  const cfg = levelConfig[scores.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-4"
    >
      {/* Annual Prediction Card */}
      <div className={`glass-card rounded-2xl p-5 border ${cfg.bg}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              In 1 Year, You Will Emit
            </p>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={scores.total}
                className={`text-4xl font-black ${cfg.color}`}
                duration={1.8}
              />
              <span className="text-gray-400 text-sm font-medium">kg CO₂</span>
            </div>
          </div>
          <span className="text-3xl">{cfg.icon}</span>
        </div>

        {/* Equivalent comparison */}
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">That&apos;s equivalent to</p>
          <p className="text-sm text-white font-medium">
            Driving{" "}
            <span className={`font-bold ${cfg.color}`}>
              {Math.round(scores.total / 0.21).toLocaleString()} km
            </span>{" "}
            by car
          </p>
          <p className="text-sm text-white font-medium mt-1">
            Needs{" "}
            <span className={`font-bold ${cfg.color}`}>
              {Math.round(scores.total / 22)} trees
            </span>{" "}
            to offset annually
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          Emissions Breakdown
        </h3>
        <div className="space-y-3">
          <BreakdownBar
            label="Travel"
            value={scores.travelCO2}
            total={scores.total}
            color="bg-blue-400"
            icon=""
          />
          <BreakdownBar
            label="Electricity"
            value={scores.electricityCO2}
            total={scores.total}
            color="bg-yellow-400"
            icon=""
          />
          <BreakdownBar
            label="Food"
            value={scores.foodCO2}
            total={scores.total}
            color="bg-orange-400"
            icon=""
          />
        </div>
      </div>

      {/* If Improved */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
          ✨ If You Make Green Choices
        </p>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={improvedTotal}
                className="text-3xl font-black text-emerald-400"
                duration={2}
              />
              <span className="text-gray-400 text-sm">kg CO₂/year</span>
            </div>
            <p className="text-emerald-400 text-sm font-medium mt-1">
              Save{" "}
              <AnimatedNumber
                value={reduction}
                className="font-bold"
                duration={2}
              />{" "}
              kg ({reductionPct}% reduction!)
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl">🌱</p>
            <p className="text-xs text-emerald-400 mt-1 font-medium">Better Future</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
