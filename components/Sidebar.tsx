"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-zinc-950 text-white p-6 border-r border-zinc-800">

      <h1 className="text-3xl font-bold text-orange-500">
        StrategyX AI
      </h1>

      <p className="text-zinc-400 text-sm mt-2">
        AI Trading Platform
      </p>

      <div className="mt-10 flex flex-col gap-3">

        <Link
          href="/dashboard"
          className="bg-zinc-900 hover:bg-orange-500 transition p-3 rounded-xl"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/strategies"
          className="bg-zinc-900 hover:bg-orange-500 transition p-3 rounded-xl"
        >
          📁 Strategies
        </Link>

        <Link
          href="/analytics"
          className="bg-zinc-900 hover:bg-orange-500 transition p-3 rounded-xl"
        >
          📈 Analytics
        </Link>

      </div>

    </div>
  );
}