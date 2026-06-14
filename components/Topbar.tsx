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
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      <div>
        <h2 className="font-bold text-xl">
          Dashboard 🚀
        </h2>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="text-xs text-gray-500">
            Logged in as
          </p>

          <p className="text-sm font-semibold">
            {email}
          </p>

        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>

      </div>

    </div>
  );
}