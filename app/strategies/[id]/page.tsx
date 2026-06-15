"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";

export default function StrategyDetails() {
  const params = useParams();

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

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          Strategy Details
        </h1>

        <div className="flex gap-3 mb-6">

          <span className="bg-green-100 px-4 py-2 rounded-lg">
            Score {strategy.score}
          </span>

          <span className="bg-blue-100 px-4 py-2 rounded-lg">
            Winrate {strategy.winrate}%
          </span>

        </div>

        <div className="mb-6">

          <h2 className="font-bold text-lg">
            Prompt
          </h2>

          <p className="mt-2">
            {strategy.prompt}
          </p>

        </div>

        <div className="mb-6">

          <h2 className="font-bold text-lg">
            Strategy
          </h2>

          <div className="bg-gray-100 p-4 rounded-2xl mt-3 whitespace-pre-wrap">
            {strategy.strategy}
          </div>

        </div>

        <div className="mb-6">

          <h2 className="font-bold text-lg">
            Created At
          </h2>

          <p className="mt-2">
            {new Date(
              strategy.created_at
            ).toLocaleString()}
          </p>

        </div>

        <div className="flex gap-4">

          <button
            onClick={copyStrategy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl"
          >
            Copy Strategy
          </button>

          <button
            onClick={exportPDF}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl"
          >
            Export PDF
          </button>

        </div>

      </div>

    </div>
  );
}