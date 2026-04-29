import { GoogleGenerativeAI } from "@google/generative-ai";

export type TravelMode = "car" | "bus" | "train" | "metro" | "bike" | "ev" | "auto";

export interface UserInputs {
  travel: number;           // km/week
  travelMode: TravelMode;
  electricity: number;      // units (kWh)/month
  foodType: "veg" | "non-veg";
  waterUsage: number;       // litres/day
}

export interface CarbonScores {
  travelCO2: number;
  electricityCO2: number;
  foodCO2: number;
  waterCO2: number;
  total: number;
  level: "low" | "medium" | "high";
}

// Indian emission factors (sources: CEA CO2 Baseline Database 2023, BEE, IPCC India)
const TRAVEL_FACTORS: Record<TravelMode, number> = {
  car: 0.192,    // kg CO2/km — avg Indian petrol car (Maruti, Hyundai class)
  bus: 0.068,    // kg CO2/km — Indian public bus (BMTC/DTC avg per passenger-km)
  train: 0.041,  // kg CO2/km — Indian Railways avg per passenger-km
  metro: 0.035,  // kg CO2/km — Delhi/Bangalore Metro avg per passenger-km
  auto: 0.130,   // kg CO2/km — auto-rickshaw (CNG/petrol mix)
  bike: 0.035,   // kg CO2/km — two-wheeler (petrol)
  ev: 0.030,     // kg CO2/km — EV (accounting for Indian grid electricity)
};

const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  car: "Car (Petrol/Diesel)",
  bus: "Public Bus",
  train: "Train",
  metro: "Metro",
  auto: "Auto Rickshaw",
  bike: "Two-Wheeler",
  ev: "Electric Vehicle",
};

// India CEA grid emission factor (2023): 0.716 tCO2/MWh = 0.716 kg CO2/kWh
const ELECTRICITY_FACTOR = 0.716;

// Food emission factors (Indian dietary studies, IARI/ICAR data)
const FOOD_FACTOR_VEG = 1.4;       // kg CO2 per day — Indian vegetarian diet
const FOOD_FACTOR_NON_VEG = 3.2;   // kg CO2 per day — Indian non-veg diet (mixed)

// Water — energy for treatment & distribution in India (CPHEEO/BIS standards)
// ~0.0005 kg CO2 per litre (pumping, treatment, heating for some usage)
const WATER_FACTOR = 0.0005;       // kg CO2 per litre

// Indian per-capita avg: ~135 litres/day (urban), national avg ~90 litres/day
// BIS recommendation: 135 litres/day for urban areas

export function calculateCarbonScore(inputs: UserInputs): CarbonScores {
  const travelFactor = TRAVEL_FACTORS[inputs.travelMode] ?? TRAVEL_FACTORS.car;

  const travelCO2 = inputs.travel * 52 * travelFactor;
  const electricityCO2 = inputs.electricity * 12 * ELECTRICITY_FACTOR;
  const foodCO2 =
    (inputs.foodType === "veg" ? FOOD_FACTOR_VEG : FOOD_FACTOR_NON_VEG) * 365;
  const waterCO2 = inputs.waterUsage * 365 * WATER_FACTOR;

  const total = travelCO2 + electricityCO2 + foodCO2 + waterCO2;

  // Thresholds based on Indian per-capita average (~1.9 tonnes/year)
  let level: "low" | "medium" | "high";
  if (total < 2000) level = "low";       // below Indian avg
  else if (total < 5000) level = "medium"; // around or above Indian avg
  else level = "high";                     // significantly above Indian avg

  return {
    travelCO2: Math.round(travelCO2),
    electricityCO2: Math.round(electricityCO2),
    foodCO2: Math.round(foodCO2),
    waterCO2: Math.round(waterCO2),
    total: Math.round(total),
    level,
  };
}

export function calculateImprovedScore(inputs: UserInputs): number {
  const improved: UserInputs = {
    travel: inputs.travel * 0.6,
    travelMode: inputs.travelMode === "car" ? "bus" : inputs.travelMode,
    electricity: inputs.electricity * 0.7,
    foodType: "veg",
    waterUsage: Math.min(inputs.waterUsage, 100), // BIS recommended efficient use
  };
  return calculateCarbonScore(improved).total;
}

export function getTravelModeLabel(mode: TravelMode): string {
  return TRAVEL_MODE_LABELS[mode] ?? mode;
}

export async function getGeminiInsights(
  inputs: UserInputs,
  scores: CarbonScores
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const travelLabel = getTravelModeLabel(inputs.travelMode);
  const indianAvg = 1900; // kg CO2/year per capita (India)
  const comparison = scores.total > indianAvg
    ? `${Math.round(((scores.total - indianAvg) / indianAvg) * 100)}% ABOVE the Indian per-capita average (${indianAvg} kg CO₂/year)`
    : `${Math.round(((indianAvg - scores.total) / indianAvg) * 100)}% BELOW the Indian per-capita average (${indianAvg} kg CO₂/year)`;

  const prompt = `You are an expert Indian environmental sustainability advisor. Analyze this person's carbon footprint and provide EXACTLY 5 extremely specific, personalized, actionable insights.

IMPORTANT CONTEXT — Indian resident:
- Travel mode: ${travelLabel}, ${inputs.travel} km/week → ${scores.travelCO2} kg CO₂/year
- Electricity: ${inputs.electricity} kWh/month → ${scores.electricityCO2} kg CO₂/year (Indian CEA grid factor: 0.716 kg/kWh)
- Diet: ${inputs.foodType} → ${scores.foodCO2} kg CO₂/year
- Water usage: ${inputs.waterUsage} litres/day → ${scores.waterCO2} kg CO₂/year
- TOTAL: ${scores.total} kg CO₂/year — ${comparison}
- Biggest contributor: ${scores.travelCO2 >= scores.electricityCO2 && scores.travelCO2 >= scores.foodCO2 && scores.travelCO2 >= scores.waterCO2 ? "Travel" : scores.electricityCO2 >= scores.foodCO2 && scores.electricityCO2 >= scores.waterCO2 ? "Electricity" : scores.foodCO2 >= scores.waterCO2 ? "Food" : "Water"}

RULES:
1. Reference SPECIFIC numbers from the user's data (mention their actual km, kWh, litres).
2. Give India-specific advice (mention Indian brands, government schemes like PM Surya Ghar, Ujala LED scheme, Indian Railways, metro systems, BIS water standards, KSRTC/BMTC/DTC buses, etc.).
3. First 2 insights MUST address the user's TOP 2 emission sources with exact saving potential in kg CO₂.
4. 3rd insight should be about water conservation specific to their usage level.
5. 4th insight should give a positive comparison or encouragement.
6. 5th insight should be a specific behavioral change with measurable impact.
7. Each insight should be 15-25 words maximum.

Return ONLY a JSON array with exactly 5 strings:
["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"]`;

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite-001",
    "gemini-pro-latest"
  ];

  let result;
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent(prompt);
      break; // Success, exit loop
    } catch (err: any) {
      console.log(`Model (${modelName}) failed:`, err?.message);
      lastError = err;
    }
  }

  if (!result) {
    console.error("All Gemini fallback models failed.");
    throw new Error(
      lastError?.message || "Google API is currently overloaded. Please try again later."
    );
  }

  try {
    const responseText = result.response.text();

    // Extract JSON array from response
    const match = responseText.match(/\[[\s\S]*?\]/);
    if (!match) {
      const lines = responseText
        .split("\n")
        .map((l: string) => l.replace(/^[-*•\d.]\s*/, "").trim())
        .filter((l: string) => l.length > 5);
      return lines.slice(0, 5);
    }

    const parsed: string[] = JSON.parse(match[0]);
    return parsed.slice(0, 5);
  } catch (error: any) {
    throw new Error(
      "AI generated invalid format. Please try again."
    );
  }
}
