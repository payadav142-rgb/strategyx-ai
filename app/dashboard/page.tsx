"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function Dashboard() {
  const [email, setEmail] = useState("");

  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    avgWinrate: 0,
  });

  const [recentStrategies, setRecentStrategies] =
    useState<any[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(user.email || "");

      const res = await fetch(
        `/api/strategies?userId=${user.id}`
      );

      const json = await res.json();

      const strategies = json.data || [];

      setRecentStrategies(
        strategies.slice(0, 3)
      );

      const total = strategies.length;

      const avgScore =
        total > 0
          ? Math.round(
              strategies.reduce(
                (sum: number, item: any) =>
                  sum + (item.score || 0),
                0
              ) / total
            )
          : 0;

      const avgWinrate =
        total > 0
          ? Math.round(
              strategies.reduce(
                (sum: number, item: any) =>
                  sum + (item.winrate || 0),
                0
              ) / total
            )
          : 0;

      setStats({
        total,
        avgScore,
        avgWinrate,
      });
    };

    getUser();
  }, []);

  const generateStrategy = async () => {    setLoading(true);

    setTimeout(() => {
      const text = prompt.toLowerCase();

      if (
        text.includes("btc") ||
        text.includes("bitcoin")
      ) {
        setGenerated({
          strategy: `
BTC Scalping Strategy

• Timeframe: 5 Minute
• RSI: 14
• EMA: 50

Entry Rules:
- Buy when RSI crosses above 30
- Price above EMA 50

Exit Rules:
- Take Profit: 2%
- Stop Loss: 1%

Risk Management:
- Risk only 1% per trade
`,
          score: 82,
          winrate: 71,
        });
      } else if (
        text.includes("eth") ||
        text.includes("ethereum")
      ) {
        setGenerated({
          strategy: `
ETH Trend Strategy

• Timeframe: 15 Minute
• MACD
• EMA: 200

Entry Rules:
- MACD Bullish Cross
- Price above EMA 200

Exit Rules:
- Take Profit: 3%
- Stop Loss: 1.5%
`,
          score: 85,
          winrate: 74,
        });
      } else if (
        text.includes("gold") ||
        text.includes("xauusd")
      ) {
        setGenerated({
          strategy: `
Gold Scalping Strategy

• Timeframe: 1 Minute
• Bollinger Bands
• RSI

Entry Rules:
- Price touches lower band
- RSI below 30

Exit Rules:
- Take Profit: 20 pips
- Stop Loss: 10 pips
`,
          score: 79,
          winrate: 68,
        });
      } else if (
        text.includes("forex") ||
        text.includes("eurusd")
      ) {
        setGenerated({
          strategy: `
Forex Trend Strategy

• Timeframe: 30 Minute
• EMA 100
• MACD

Entry Rules:
- EMA Trend Confirmation
- MACD Cross

Exit Rules:
- Risk Reward 1:2
`,
          score: 80,
          winrate: 70,
        });
      } else {
        setGenerated({
          strategy: `
Universal Trading Strategy

• RSI 14
• EMA 50

Entry Rules:
- RSI Oversold
- Trend Confirmation

Exit Rules:
- TP 2%
- SL 1%
`,
          score: 75,
          winrate: 65,
        });
      }

      setLoading(false);
    }, 1000);
  };

  const saveStrategy = async () => {
    if (!generated) return;

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first");
        return;
      }

      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          prompt,
          strategy: generated.strategy,
          score: generated.score,
          winrate: generated.winrate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Strategy Saved ✅");

        setRecentStrategies((prev) => [
          {
            id: Date.now(),
            prompt,
            score: generated.score,
            winrate: generated.winrate,
          },
          ...prev,
        ].slice(0, 3));

        setStats((prev) => ({
          total: prev.total + 1,
          avgScore: generated.score,
          avgWinrate: generated.winrate,
        }));
      } else {
        alert("Error saving strategy");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (<div className="flex min-h-screen bg-gray-100">

  <Sidebar />

  <div className="flex-1">

    <Topbar email={email} />

    <div className="p-8">

      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-lg mb-8">

        <h1 className="text-4xl font-bold">
          Welcome Back 🚀
        </h1>

        <p className="mt-2 text-orange-100">
          Generate, Save and Analyze Trading Strategies with AI
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-3xl shadow-lg border">
          <p className="text-gray-500">
            Total Strategies
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.total}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border">
          <p className="text-gray-500">
            Average Score
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.avgScore}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border">
          <p className="text-gray-500">
            Win Rate
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.avgWinrate}%
          </h2>
        </div>

      </div>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Account Information
        </h2>

        <p className="text-gray-600">
          Logged in as:
        </p>

        <p className="font-semibold mt-2">
          {email}
        </p>

      </div>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Recent Activity
        </h2>

        <div className="space-y-3">

          <div className="bg-gray-100 p-3 rounded-xl">
            ✅ Strategies Created: {stats.total}
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            ⭐ Average Score: {stats.avgScore}
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            🏆 Win Rate: {stats.avgWinrate}%
          </div>

        </div>

      </div>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-lg">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">
            Recent Strategies
          </h2>

          <span className="text-sm text-gray-500">
            Latest 3
          </span>

        </div>

        {recentStrategies.length === 0 ? (

          <div className="text-gray-500">
            No saved strategies yet
          </div>

        ) : (

          <div className="space-y-4">

            {recentStrategies.map((item) => (

              <div
                key={item.id}
                className="border rounded-2xl p-4"
              >

                <div className="flex gap-3 mb-2">

                  <span className="bg-green-100 px-3 py-1 rounded-lg text-sm">
                    Score {item.score}
                  </span>

                  <span className="bg-blue-100 px-3 py-1 rounded-lg text-sm">
                    Winrate {item.winrate}%
                  </span>

                </div>

                <p className="font-semibold">
                  {item.prompt}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Smart AI Generator
        </h2>

        <textarea
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          placeholder="BTC Scalping, ETH Trend, Gold Scalping, Forex Strategy..."
          className="w-full border-2 border-gray-200 rounded-2xl p-4 h-32 focus:outline-none focus:border-orange-500"
        />
                <button
          onClick={generateStrategy}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold"
        >
          {loading
            ? "Generating..."
            : "Generate Strategy"}
        </button>

        {generated && (
          <div className="mt-6 border-t pt-6">

            <div className="flex gap-4 mb-4">

              <div className="bg-green-100 px-4 py-2 rounded-lg">
                Score: {generated.score}
              </div>

              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                Winrate: {generated.winrate}%
              </div>

            </div>

            <div className="bg-gray-100 p-4 rounded-xl whitespace-pre-wrap">
              {generated.strategy}
            </div>

            <button
              onClick={saveStrategy}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              {saving
                ? "Saving..."
                : "Save Strategy"}
            </button>

          </div>
        )}

      </div>

    </div>

  </div>

</div>
  );
}