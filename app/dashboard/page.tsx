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
    };

    getUser();
  }, []);

  const generateStrategy = async () => {
    setLoading(true);

    setTimeout(() => {
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
- Avoid major news events

AI Notes:
- Best for BTC and ETH
- Performs well in trending markets
`,
        score: 82,
        winrate: 71,
      });

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Topbar email={email} />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Welcome Back 🚀
          </h1>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">
                Total Strategies
              </p>

              <h2 className="text-3xl font-bold mt-2">
                0
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">
                Average Score
              </p>

              <h2 className="text-3xl font-bold mt-2">
                82
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">
                Win Rate
              </p>

              <h2 className="text-3xl font-bold mt-2">
                71%
              </h2>
            </div>

          </div>

          {/* ACCOUNT INFO */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow">

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

          {/* AI GENERATOR */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold mb-4">
              AI Strategy Generator
            </h2>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create a BTC scalping strategy using RSI and EMA"
              className="w-full border rounded-xl p-4 h-32"
            />

            <button
              onClick={generateStrategy}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl"
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

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}