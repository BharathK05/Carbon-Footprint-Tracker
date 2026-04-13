import { GoogleGenerativeAI } from "@google/generative-ai";

export interface UserInputs {
  travel: number;       // km/week
  electricity: number;  // units/month
  foodType: "veg" | "non-veg";
}

export interface CarbonScores {
  travelCO2: number;
  electricityCO2: number;
  foodCO2: number;
  total: number;
  level: "low" | "medium" | "high";
}

export function calculateCarbonScore(inputs: UserInputs): CarbonScores {
  // CO2 emission factors
  const TRAVEL_FACTOR = 0.21;       // kg CO2 per km (avg car)
  const ELECTRICITY_FACTOR = 0.82;  // kg CO2 per kWh (India avg)
  const FOOD_FACTOR_VEG = 1.5;      // kg CO2 per day
  const FOOD_FACTOR_NON_VEG = 3.3;  // kg CO2 per day

  const travelCO2 = inputs.travel * 52 * TRAVEL_FACTOR;
  const electricityCO2 = inputs.electricity * 12 * ELECTRICITY_FACTOR;
  const foodCO2 =
    (inputs.foodType === "veg" ? FOOD_FACTOR_VEG : FOOD_FACTOR_NON_VEG) * 365;

  const total = travelCO2 + electricityCO2 + foodCO2;

  let level: "low" | "medium" | "high";
  if (total < 3000) level = "low";
  else if (total < 7000) level = "medium";
  else level = "high";

  return {
    travelCO2: Math.round(travelCO2),
    electricityCO2: Math.round(electricityCO2),
    foodCO2: Math.round(foodCO2),
    total: Math.round(total),
    level,
  };
}

export function calculateImprovedScore(inputs: UserInputs): number {
  const improved: UserInputs = {
    travel: inputs.travel * 0.6,
    electricity: inputs.electricity * 0.7,
    foodType: "veg",
  };
  return calculateCarbonScore(improved).total;
}

export async function getGeminiInsights(
  inputs: UserInputs,
  scores: CarbonScores
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  // Initialize the official Gemini SDK
  const genAI = new GoogleGenerativeAI(apiKey);
  // Models will be initialized inside the try-catch block for fallback support

  const prompt = `You are an environmental expert AI. Analyze this person's carbon footprint data and provide exactly 3 extremely brief, punchy, actionable bullet points.

User's annual carbon footprint data:
- Travel: ${scores.travelCO2} kg CO2/year (${inputs.travel} km/week)
- Electricity: ${scores.electricityCO2} kg CO2/year (${inputs.electricity} units/month)
- Food (${inputs.foodType}): ${scores.foodCO2} kg CO2/year
- Total annual footprint: ${scores.total} kg CO2
- Impact level: ${scores.level.toUpperCase()}

Provide exactly 3 insights in JSON array format. Each insight must be a short, direct bullet point (under 15 words). Format:
["insight 1", "insight 2", "insight 3"]

Focus on: biggest contributor, realistic improvement tip, positive encouragement. Use formatting like "Focus on: [action] to save [amount]".`;

  let result;
  
  try {
    // 1. First try the model you requested:
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    result = await model.generateContent(prompt);
  } catch (err1: any) {
    console.log("Primary model (gemini-2.5-flash) failed:", err1?.message);
    try {
      // 2. Fallback to older gemini-pro if Google servers are busy (503)
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      result = await fallbackModel.generateContent(prompt);
    } catch (err2: any) {
      console.error("All Gemini models failed:", err2);
      throw new Error(err1?.message || "Google API models are currently unavailable.");
    }
  }

  try {
    const responseText = result.response.text();

    // Extract JSON array from response
    const match = responseText.match(/\[[\s\S]*?\]/);
    if (!match) {
      // Fallback: split by newlines and return first 3 non-empty lines
      const lines = responseText
        .split("\n")
        .map((l: string) => l.replace(/^[-*•\d.]\s*/, "").trim())
        .filter((l: string) => l.length > 5);
      return lines.slice(0, 3);
    }

    const parsed: string[] = JSON.parse(match[0]);
    return parsed.slice(0, 3);
  } catch (error: any) {
    throw new Error(
      "AI generated invalid format. Please try again."
    );
  }
}
