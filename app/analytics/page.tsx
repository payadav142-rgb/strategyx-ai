"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { supabase } from "../lib/supabase";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    total: 0,
    avgScore: 0,
    avgWinrate: 0,
    bestScore: 0,
  });

  const [scoreData, setScoreData] = useState<any[]>([]);
  const [winrateData, setWinrateData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

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

        const res = await fetch(
          `/api/strategies?userId=${user.id}`
        );

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
                  (item: any) =>
                    item.score || 0
                )
              )
            : 0;

        setAnalytics({
          total,
          avgScore,
          avgWinrate,
          bestScore,
        });

        const chartData = data.map(
          (item: any, index: number) => ({
            name: `S${index + 1}`,
            score: item.score || 0,
            winrate: item.winrate || 0,
          })
        );

        setScoreData(chartData);
        setWinrateData(chartData);

        const low = data.filter(
          (item: any) =>
            (item.score || 0) <= 60
        ).length;

        const medium = data.filter(
          (item: any) =>
            item.score > 60 &&
            item.score <= 75
        ).length;

        const high = data.filter(
          (item: any) =>
            item.score > 75 &&
            item.score <= 85
        ).length;

        const elite = data.filter(
          (item: any) =>
            item.score > 85
        ).length;

        setPieData([
          {
            name: "0-60",
            value: low,
          },
          {
            name: "61-75",
            value: medium,
          },
          {
            name: "76-85",
            value: high,
          },
          {
            name: "86+",
            value: elite,
          },
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = [
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
    "#10b981",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar email="" />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-8">
            Analytics Dashboard 📊
          </h1>

          {loading ? (
            <div className="bg-white p-6 rounded-2xl shadow">
              Loading...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <div className="bg-white p-6 rounded-3xl shadow">
                  <p className="text-gray-500">
                    Total Strategies
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {analytics.total}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <p className="text-gray-500">
                    Average Score
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {analytics.avgScore}
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <p className="text-gray-500">
                    Average Winrate
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {analytics.avgWinrate}%
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <p className="text-gray-500">
                    Best Score
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {analytics.bestScore}
                  </h2>
                </div>

              </div>

              <div className="grid lg:grid-cols-2 gap-8">

                <div className="bg-white p-6 rounded-3xl shadow">
                  <h2 className="font-bold text-xl mb-4">
                    Score Trend
                  </h2>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <LineChart data={scoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <h2 className="font-bold text-xl mb-4">
                    Winrate Analysis
                  </h2>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <BarChart data={winrateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="winrate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>

              <div className="mt-8 bg-white p-6 rounded-3xl shadow">

                <h2 className="font-bold text-xl mb-4">
                  Score Distribution
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={350}
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={120}
                      label
                    >
                      {pieData.map(
                        (_, index) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[index]
                            }
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}