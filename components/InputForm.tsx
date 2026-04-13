"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onSubmit: (inputs: {
    travel: number;
    electricity: number;
    foodType: "veg" | "non-veg";
  }) => void;
}

export default function InputForm({ onSubmit }: Props) {
  const [travel, setTravel] = useState(100);
  const [electricity, setElectricity] = useState(150);
  const [foodType, setFoodType] = useState<"veg" | "non-veg">("veg");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ travel, electricity, foodType });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-6"
    >
      <h2 className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2">
        <span className="text-neon">⚡</span> Your Lifestyle Data
      </h2>

      {/* Travel Slider */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            Travel Distance
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
      </div>

      {/* Electricity Slider */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
            Electricity Usage
          </label>
          <span className="text-neon font-bold text-lg">{electricity} units/month</span>
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
          <span>1000</span>
        </div>
      </div>

      {/* Food Type Toggle */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
          Diet Type
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
              {type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
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
