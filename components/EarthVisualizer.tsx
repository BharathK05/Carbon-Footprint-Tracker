"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import createGlobe from "cobe";

type EarthLevel = "low" | "medium" | "high";

interface Props {
  level: EarthLevel;
  score: number;
}

const earthConfig = {
  low: {
    baseColor: [0.3, 0.3, 0.3] as [number, number, number], 
    glowColor: [0.0, 0.9, 1.0] as [number, number, number],
    label: "Thriving",
    labelColor: "text-cyan-400",
    badge: "🌍 Healthy Planet",
    badgeBg: "bg-cyan-500/20 border-cyan-500/40",
  },
  medium: {
    baseColor: [0.3, 0.3, 0.3] as [number, number, number], 
    glowColor: [0.9, 0.7, 0.1] as [number, number, number],
    label: "Under Stress",
    labelColor: "text-yellow-400",
    badge: "⚠️ Moderate Risk",
    badgeBg: "bg-yellow-500/20 border-yellow-500/40",
  },
  high: {
    baseColor: [0.3, 0.3, 0.3] as [number, number, number], 
    glowColor: [0.9, 0.2, 0.1] as [number, number, number],
    label: "Critical Danger",
    labelColor: "text-red-400",
    badge: "🔴 Critical Alert",
    badgeBg: "bg-red-500/20 border-red-500/40",
  },
};

export default function EarthVisualizer({ level, score }: Props) {
  const config = earthConfig[level];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let globe: any;

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600,
        height: 600,
        phi: 0,
        theta: 0.15,
        dark: 1, // 1 is dark theme
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: config.baseColor,
        markerColor: [1, 1, 1],
        glowColor: config.glowColor,
        markers: [],
        onRender: (state) => {
          // Rotate the globe on its axis
          state.phi = phi;
          phi += 0.005;
        },
      });
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
    };
  }, [config.baseColor, config.glowColor]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 3D Planet container */}
      <div className="relative flex items-center justify-center w-[300px] h-[300px]">
        {/* Render Cobe 3D Earth */}
        <canvas
          ref={canvasRef}
          style={{ width: 300, height: 300, cursor: "grab" }}
          className="absolute inset-0 m-auto"
        />
      </div>

      {/* Status badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level + "-badge"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className={`px-5 py-2 rounded-full border text-sm font-semibold backdrop-blur-sm ${config.badgeBg}`}
        >
          {config.badge}
        </motion.div>
      </AnimatePresence>

      {/* Score display */}
      <div className="text-center">
        <motion.p
          className={`text-lg font-bold ${config.labelColor}`}
          key={level + "-label"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Earth Status: {config.label}
        </motion.p>
        {score > 0 && (
          <p className="text-gray-400 text-sm mt-1">
            Annual footprint:{" "}
            <span className="text-white font-semibold">
              {score.toLocaleString()} kg CO₂
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
