import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Strategy ID required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("SUPABASE ERROR =", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}