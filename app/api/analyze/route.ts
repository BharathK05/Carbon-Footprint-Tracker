import { NextRequest, NextResponse } from "next/server";
import { getGeminiInsights, UserInputs, CarbonScores } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputs, scores }: { inputs: UserInputs; scores: CarbonScores } = body;

    if (!inputs || !scores) {
      return NextResponse.json(
        { error: "Missing inputs or scores in request body." },
        { status: 400 }
      );
    }

    const insights = await getGeminiInsights(inputs, scores);
    return NextResponse.json({ insights });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[/api/analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
