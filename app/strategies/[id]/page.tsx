"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function StrategyDetails() {
  const params = useParams();
  const router = useRouter();

  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStrategy = async () => {
      try {
        const res = await fetch(
          `/api/strategy?id=${params.id}`
        );

        const data = await res.json();

        if (data.success) {
          setStrategy(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getStrategy();
  }, [params.id]);

  const copyStrategy = () => {
    if (!strategy) return;

    navigator.clipboard.writeText(
      strategy.strategy
    );

    alert("Strategy Copied ✅");
  };

  const exportPDF = () => {
    if (!strategy) return;

    const doc = new jsPDF();

    doc.text(
      strategy.strategy,
      10,
      10
    );

    doc.save("strategy.pdf");
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="p-8">
        Strategy not found
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-5xl mx-auto">

      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-2xl"
      >
        ← Back to Strategies
      </button>

      <div className="bg-white rounded-3xl shadow-lg border p-8">

        <h1 className="text-4xl font-bold mb-2">
          Strategy Details
        </h1>

        <p className="text-gray-500 mb-8">
          Full strategy analysis and metrics
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <div className="bg-green-100 p-6 rounded-3xl">
            <p className="text-gray-600">
              Strategy Score
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {strategy.score}
            </h2>
          </div>

          <div className="bg-blue-100 p-6 rounded-3xl">
            <p className="text-gray-600">
              Win Rate
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {strategy.winrate}%
            </h2>
          </div>

        </div>

        <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl mb-6">

          <h2 className="font-bold text-xl mb-3">
            Prompt
          </h2>

          <p className="text-gray-700">
            {strategy.prompt}
          </p>

        </div>

        <div className="bg-gray-50 border p-6 rounded-3xl mb-6">

          <h2 className="font-bold text-xl mb-4">
            Strategy
          </h2>

          <div className="whitespace-pre-wrap leading-7">
            {strategy.strategy}
          </div>

        </div>

        <div className="bg-gray-50 border p-6 rounded-3xl mb-8">

          <h2 className="font-bold text-xl mb-3">
            Created At
          </h2>

          <p>
            {new Date(
              strategy.created_at
            ).toLocaleString()}
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={copyStrategy}
            className="min-w-[180px] bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-semibold"
          >
            Copy Strategy
          </button>

          <button
            onClick={exportPDF}
            className="min-w-[180px] bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-2xl font-semibold"
          >
            Export PDF
          </button>

        </div>

      </div>

    </div>

  </div>
);
}