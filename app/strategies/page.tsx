"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

interface Strategy {
  id: string;
  prompt: string;
  strategy: string;
  score: number;
  winrate: number;
}

export default function StrategiesPage() {
  const [data, setData] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const res = await fetch("/api/strategies");
        const json = await res.json();

        setData(json.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Topbar email="" />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Saved Strategies
          </h1>

          {loading && (
            <div className="bg-white p-6 rounded-2xl shadow">
              Loading...
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              No strategies found
            </div>
          )}

          <div className="grid gap-4">

            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow"
              >

                <div className="flex gap-3 mb-4">

                  <span className="bg-green-100 px-3 py-1 rounded-lg">
                    Score {item.score}
                  </span>

                  <span className="bg-blue-100 px-3 py-1 rounded-lg">
                    Winrate {item.winrate}%
                  </span>

                </div>

                <p className="font-semibold mb-2">
                  {item.prompt}
                </p>

                <div className="bg-gray-100 p-4 rounded-xl whitespace-pre-wrap">
                  {item.strategy}
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}