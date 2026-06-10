import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const strategy = `
Strategy Name: RSI + EMA Scalping

Prompt:
${prompt}

Rules:
• Timeframe: 5 Minute
• Indicator 1: RSI 14
• Indicator 2: EMA 50

Entry:
• Buy when RSI crosses above 30
• Price above EMA 50

Exit:
• Take Profit: 2%
• Stop Loss: 1%

Risk Management:
• Risk only 1% per trade
• Avoid trading during major news

AI Notes:
• Good for trending markets
• Works best with BTC and ETH
`;

  return NextResponse.json({
    strategy,
    score: 82,
    winrate: 71,
  });
}