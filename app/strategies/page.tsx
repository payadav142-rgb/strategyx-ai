"use client";
import Link from "next/link";
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
  category: string;
}

export default function StrategiesPage() {
  const [data, setData] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
  useState("All");


  const [editing, setEditing] =
  useState<any>(null);

const [editPrompt, setEditPrompt] =
  useState("");

const [editStrategy, setEditStrategy] =
  useState("");
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


  const openEdit = (item: any) => {
  setEditing(item);

  setEditPrompt(
    item.prompt || ""
  );

  setEditStrategy(
    item.strategy || ""
  );
};


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
  const saveChanges = async () => {
  try {
    const res = await fetch(
      "/api/update",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: editing.id,
          prompt: editPrompt,
          strategy: editStrategy,
        }),
      }
    );

    const data =
      await res.json();

    if (data.success) {

      setData((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                prompt:
                  editPrompt,
                strategy:
                  editStrategy,
              }
            : item
        )
      );

      alert(
        "Updated Successfully ✅"
      );

      setEditing(null);
    }
  } catch (error) {
    console.log(error);
  }
};

  const filteredStrategies =
  data.filter((item) => {

    const matchSearch =
      item.prompt
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchCategory =
      categoryFilter === "All"
        ? true
        : item.category ===
          categoryFilter;

    return (
      matchSearch &&
      matchCategory
    );
  });

  return (
  <>
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
          <div className="mb-6">
  <select
    value={categoryFilter}
    onChange={(e) =>
      setCategoryFilter(e.target.value)
    }
    className="
      w-full
      border
      rounded-2xl
      p-4
      bg-white
    "
  >
    <option value="All">All Categories</option>
    <option value="Crypto">Crypto</option>
    <option value="Forex">Forex</option>
    <option value="Stocks">Stocks</option>
    <option value="Gold">Gold</option>
    <option value="Options">Options</option>
  </select>
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
                className="
  bg-white
  p-6
  rounded-3xl
  shadow-lg
  border
  hover:shadow-xl
  transition
"
              >

                <div className="flex justify-between items-start">

                  <div className="flex gap-3">

                    <span className="bg-green-100 px-3 py-1 rounded-lg">
                      Score {item.score}
                    </span>

                    <span className="bg-blue-100 px-3 py-1 rounded-lg">
                      Winrate {item.winrate}%
                    </span>
                    <span className="bg-purple-100 px-3 py-1 rounded-lg">
  {item.category}
</span>

                  </div>

                  <div className="flex gap-2">

  <Link
    href={`/strategies/${item.id}`}
    className="
      bg-orange-500
      hover:bg-orange-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    View
  </Link>

  <button
  onClick={() =>
    openEdit(item)
  }
  className="
    bg-yellow-500
    hover:bg-yellow-600
    text-white
    px-4
    py-2
    rounded-lg
  "
>
  Edit
</button>

  <button
    onClick={() =>
      deleteStrategy(item.id)
    }
    className="
      bg-red-500
      hover:bg-red-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    Delete
  </button>

</div>

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
   {editing && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

  <div className="bg-white w-[700px] rounded-3xl p-8">

    <h2 className="text-2xl font-bold mb-6">
      Edit Strategy
    </h2>

    <input
      value={editPrompt}
      onChange={(e) =>
        setEditPrompt(e.target.value)
      }
      className="w-full border p-4 rounded-xl mb-4"
      placeholder="Prompt"
    />

    <textarea
      value={editStrategy}
      onChange={(e) =>
        setEditStrategy(e.target.value)
      }
      className="w-full border p-4 rounded-xl h-60 mb-4"
      placeholder="Strategy"
    />

    <div className="flex gap-3">

      <button
        onClick={saveChanges}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Save Changes
      </button>

      <button
        onClick={() => setEditing(null)}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
      >
        Cancel
      </button>

    </div>

  </div>

</div>

)}
    </>
  );
}