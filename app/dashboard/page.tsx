"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function Dashboard() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(user.email || "");
    };

    getUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Topbar email={email} />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Welcome Back 🚀
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">
                Total Strategies
              </p>

              <h2 className="text-3xl font-bold mt-2">
                0
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">
                Average Score
              </p>

              <h2 className="text-3xl font-bold mt-2">
                0
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">
                Win Rate
              </p>

              <h2 className="text-3xl font-bold mt-2">
                0%
              </h2>
            </div>

          </div>

          <div className="mt-8 bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold mb-4">
              Account Information
            </h2>

            <p className="text-gray-600">
              Logged in as:
            </p>

            <p className="font-semibold mt-2">
              {email}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}