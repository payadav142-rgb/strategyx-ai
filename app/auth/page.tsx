"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful");

    router.push("/dashboard");
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful");

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl border w-full max-w-md shadow">

        <h1 className="text-3xl font-bold mb-6 text-center">
          StrategyX AI
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        <div className="flex gap-3">

          <button
            onClick={signIn}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl"
          >
            Login
          </button>

          <button
            onClick={signUp}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl"
          >
            Signup
          </button>

        </div>

      </div>

    </div>
  );
}