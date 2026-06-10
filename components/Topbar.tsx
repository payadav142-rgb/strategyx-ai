"use client";

import { supabase } from "../app/lib/supabase";

export default function Topbar({
  email,
}: {
  email: string;
}) {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      <h2 className="font-semibold text-lg">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <span className="text-sm text-gray-500">
          {email}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}