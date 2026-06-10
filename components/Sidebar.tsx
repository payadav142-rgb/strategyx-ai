"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-orange-500">
        StrategyX AI
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/strategies">Strategies</Link>
        <Link href="/analytics">Analytics</Link>
      </div>
    </div>
  );
}