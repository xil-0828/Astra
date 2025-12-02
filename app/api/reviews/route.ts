// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// -----------------------
// POST: Insert Review
// -----------------------
export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { anime_id, score, comment } = body;

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // DB INSERT
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      anime_id,
      score,
      comment,
      user_id: user.id,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// -----------------------
// GET: Fetch Reviews
// -----------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const anime_id = searchParams.get("anime_id");

  const supabase = await createClient(); // ← ★ ここも async

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("anime_id", anime_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
