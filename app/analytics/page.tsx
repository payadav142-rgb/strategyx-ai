"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { supabase } from "../lib/supabase";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    total: 0,
    avgScore: 0,
    avgWinrate: 0,
    bestScore: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/auth";
          return;
        }

        const res = await fetch(`/api/strategies?userId=${user.id}`);
        const json = await res.json();

        const data = json.data || [];

        const total = data.length;

        const avgScore =
          total > 0
            ? Math.round(
                data.reduce(
                  (sum: number, item: any) =>
                    sum + (item.score || 0),
                  0
                ) / total
              )
            : 0;

        const avgWinrate =
          total > 0
            ? Math.round(
                data.reduce(
                  (sum: number, item: any) =>
                    sum + (item.winrate || 0),
                  0
                ) / total
              )
            : 0;

        const bestScore =
          total > 0
            ? Math.max(
                ...data.map(
                  (item: any) => item.score || 0
                )
              )
            : 0;

        setAnalytics({
          total,
          avgScore,
          avgWinrate,
          bestScore,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Topbar email="" />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Analytics 📊
          </h1>

          {loading ? (
            <div className="bg-white p-6 rounded-2xl shadow">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">
                  Total Strategies
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {analytics.total}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">
                  Average Score
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {analytics.avgScore}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">
                  Average Winrate
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {analytics.avgWinrate}%
                </h2>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">
                  Best Score
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {analytics.bestScore}
                </h2>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}