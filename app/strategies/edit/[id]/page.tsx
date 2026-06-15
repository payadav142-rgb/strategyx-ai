"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditStrategyPage() {
  const params = useParams();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [strategy, setStrategy] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStrategy();
  }, []);

  const fetchStrategy = async () => {
    try {
      const res = await fetch(
        `/api/strategy?id=${params.id}`
      );

      const json = await res.json();

      if (json.data) {
        setPrompt(json.data.prompt);
        setStrategy(json.data.strategy);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStrategy = async () => {
    try {
      setSaving(true);

      const res = await fetch(
        "/api/update",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: params.id,
            prompt,
            strategy,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(
          "Strategy Updated ✅"
        );

        router.push(
          "/strategies"
        );
      } else {
        alert(
          "Update Failed"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }
    return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6">
          Edit Strategy
        </h1>

        <div className="mb-4">

          <label className="block mb-2 font-semibold">
            Prompt
          </label>

          <input
            type="text"
            value={prompt}
            onChange={(e) =>
              setPrompt(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-xl"
          />

        </div>

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Strategy
          </label>

          <textarea
            value={strategy}
            onChange={(e) =>
              setStrategy(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-xl h-80"
          />

        </div>

        <button
          onClick={updateStrategy}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

    </div>
  );
}