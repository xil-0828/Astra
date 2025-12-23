export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { analyzePerspectiveDirect } from "@/utils/api/analyzePerspectiveDirect";

// -----------------------
// POST: Insert Review
// -----------------------
export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { anime_id, score, comment } = body;

  // =======================
  // 認証（Bearer）
  // =======================
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const text = comment as string;

  // =======================
  // ① NGワード
  // =======================
  const NG_WORDS = [
    "死ね",
    "殺す",
    "障害者",
    "レイプ",
    "薬物",
    "爆破",
    "自殺",
  ];

  if (NG_WORDS.some((w) => text.includes(w))) {
    return NextResponse.json(
      { error: "不適切な表現が含まれています。" },
      { status: 400 }
    );
  }

  // =======================
  // ② 個人情報チェック
  // =======================
  const personalPatterns = [
    /\b0\d{1,4}-\d{1,4}-\d{3,4}\b/,
    /\b0\d{9,10}\b/,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
    /\b\d{3}-\d{4}\b/,
  ];

  if (personalPatterns.some((re) => re.test(text))) {
    return NextResponse.json(
      { error: "個人情報を含む内容は投稿できません。" },
      { status: 400 }
    );
  }

  // =======================
  // ③ Perspective（タイムアウト付き）
  // =======================
  let toxicity = 0;
  let insult = 0;
  let profanity = 0;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // ★ 3秒で諦める

    const result = await analyzePerspectiveDirect(text, controller.signal);

    clearTimeout(timeoutId);

    toxicity =
      result.attributeScores?.TOXICITY?.summaryScore?.value ?? 0;
    insult =
      result.attributeScores?.INSULT?.summaryScore?.value ?? 0;
    profanity =
      result.attributeScores?.PROFANITY?.summaryScore?.value ?? 0;
  } catch (e) {
    // ★ Perspective が死んでも投稿は止めない
    console.log("Perspective skipped:", e);
  }

  if (toxicity > 0.75 || insult > 0.7 || profanity > 0.65) {
    return NextResponse.json(
      { error: "不適切な表現が含まれています。" },
      { status: 400 }
    );
  }

  // =======================
  // ④ DB INSERT
  // =======================
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
// GET: Fetch Reviews（変更なし）
// -----------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const anime_id = searchParams.get("anime_id");

  const supabase = await createClient();

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
