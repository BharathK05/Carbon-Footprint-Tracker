"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TravelMode } from "@/lib/gemini";

interface Props {
  onSubmit: (inputs: {
    travel: number;
    travelMode: TravelMode;
    electricity: number;
    foodType: "veg" | "non-veg";
    waterUsage: number;
  }) => void;
}

const TRAVEL_MODES: { key: TravelMode; label: string; icon: string }[] = [
  { key: "car", label: "Car", icon: "🚗" },
  { key: "bike", label: "2-Wheeler", icon: "🏍️" },
  { key: "bus", label: "Bus", icon: "🚌" },
  { key: "train", label: "Train", icon: "🚆" },
  { key: "metro", label: "Metro", icon: "🚇" },
  { key: "auto", label: "Auto", icon: "🛺" },
  { key: "ev", label: "EV", icon: "⚡" },
];

export default function InputForm({ onSubmit }: Props) {
  const [travel, setTravel] = useState(100);
  const [travelMode, setTravelMode] = useState<TravelMode>("car");
  const [electricity, setElectricity] = useState(150);
  const [foodType, setFoodType] = useState<"veg" | "non-veg">("veg");
  const [waterUsage, setWaterUsage] = useState(135);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ travel, travelMode, electricity, foodType, waterUsage });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-5"
    >
      <h2 className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2">
        <span className="text-neon">⚡</span> Your Lifestyle Data
      </h2>

      {/* Travel Distance Slider */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            🚗 Travel Distance
          </label>
          <span className="text-neon font-bold text-lg">{travel} km/week</span>
        </div>
        <input
          id="travel-input"
          type="range"
          min={0}
          max={1000}
          step={10}
          value={travel}
          onChange={(e) => setTravel(Number(e.target.value))}
          className="w-full accent-neon h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 km</span>
          <span>500 km</span>
          <span>1000 km</span>
        </div>

        {/* Travel Mode Selection */}
        <div className="pt-2 space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            Mode of Travel
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TRAVEL_MODES.map((mode) => (
              <motion.button
                key={mode.key}
                type="button"
                id={`travel-mode-${mode.key}`}
                onClick={() => setTravelMode(mode.key)}
                whileTap={{ scale: 0.94 }}
                className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all duration-200 flex flex-col items-center gap-1 ${
                  travelMode === mode.key
                    ? "neon-border bg-neon/10 text-neon shadow-neon-sm"
                    : "border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                <span className="text-base">{mode.icon}</span>
                <span className="leading-tight">{mode.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Electricity Slider */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            ⚡ Electricity Usage
          </label>
          <span className="text-neon font-bold text-lg">{electricity} kWh/month</span>
        </div>
        <input
          id="electricity-input"
          type="range"
          min={0}
          max={1000}
          step={10}
          value={electricity}
          onChange={(e) => setElectricity(Number(e.target.value))}
          className="w-full accent-neon h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>500</span>
          <span>1000 kWh</span>
        </div>
        <p className="text-[10px] text-gray-600 italic">
          Indian avg household: ~90 kWh/month (CEA 2023)
        </p>
      </div>

      {/* Water Usage Slider */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            💧 Water Usage
          </label>
          <span className="text-neon font-bold text-lg">{waterUsage} L/day</span>
        </div>
        <input
          id="water-input"
          type="range"
          min={0}
          max={500}
          step={5}
          value={waterUsage}
          onChange={(e) => setWaterUsage(Number(e.target.value))}
          className="w-full accent-neon h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 L</span>
          <span>250 L</span>
          <span>500 L</span>
        </div>
        <p className="text-[10px] text-gray-600 italic">
          BIS recommended: 135 L/day per person (urban India)
        </p>
      </div>

      {/* Food Type Toggle */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
          🍽️ Diet Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["veg", "non-veg"] as const).map((type) => (
            <motion.button
              key={type}
              type="button"
              id={`food-${type}`}
              onClick={() => setFoodType(type)}
              whileTap={{ scale: 0.96 }}
              className={`py-3 rounded-lg font-semibold text-sm border transition-all duration-200 capitalize ${foodType === type
                  ? "neon-border bg-neon/10 text-neon"
                  : "border-white/10 text-gray-400 hover:border-white/30"
                }`}
            >
              {type === "veg" ? "🥦 Vegetarian" : "🍗 Non-Vegetarian"}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        id="calculate-btn"
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-bold text-black bg-neon hover:bg-neon/90 transition-all duration-200 text-base shadow-neon"
      >
        Calculate My Impact
      </motion.button>
    </motion.form>
  );
}
