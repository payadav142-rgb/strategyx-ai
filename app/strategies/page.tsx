"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../app/lib/supabase";
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
  const [search, setSearch] = useState("");

  const fetchStrategies = async () => {
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

      setData(json.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const deleteStrategy = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this strategy?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (result.success) {
        setData((prev) =>
          prev.filter((item) => item.id !== id)
        );

        alert("Strategy Deleted ✅");
      } else {
        alert("Delete Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const filteredStrategies = data.filter((item) =>
    item.prompt
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar email="" />

        <div className="p-8">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Saved Strategies
            </h1>

            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-semibold">
              {filteredStrategies.length} Strategies
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search BTC, ETH, Gold..."
              className="
                w-full
                border
                rounded-2xl
                p-4
                bg-white
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          {loading && (
            <div className="bg-white p-6 rounded-2xl shadow">
              Loading...
            </div>
          )}

          {!loading &&
            filteredStrategies.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
                No Strategies Found
              </div>
            )}

          <div className="grid gap-4">

            {filteredStrategies.map((item) => (

              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow"
              >

                <div className="flex justify-between items-start">

                  <div className="flex gap-3">

                    <span className="bg-green-100 px-3 py-1 rounded-lg">
                      Score {item.score}
                    </span>

                    <span className="bg-blue-100 px-3 py-1 rounded-lg">
                      Winrate {item.winrate}%
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      deleteStrategy(item.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

                <p className="font-semibold mt-4 mb-2">
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