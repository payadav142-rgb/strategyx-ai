import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {

    const {
  id,
  prompt,
  strategy,
  favorite,
  notes,
  tags,
} = await req.json();

    const updateData: any = {};

    if (prompt !== undefined) {
      updateData.prompt = prompt;
    }

    if (strategy !== undefined) {
      updateData.strategy = strategy;
    }

    if (favorite !== undefined) {
      updateData.favorite = favorite;
    }

    if (notes !== undefined) {
  updateData.notes = notes;
}

if (tags !== undefined) {
  updateData.tags = tags;
}

    const { error } = await supabase
      .from("strategies")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}