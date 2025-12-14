export const runtime = "edge";


// app/api/reviews/route.ts
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

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const text = comment as string;

  // ① NGワード辞書
  const NG_WORDS = [
    "死ね",
    "殺す",
    "障害者",
    "レイプ",
    "薬物",
    "爆破",
    "自殺",
  ];

  function containsNgWord(str: string) {
    return NG_WORDS.some((w) => str.includes(w));
  }

  if (containsNgWord(text)) {
    return NextResponse.json(
      { error: "不適切な表現が含まれているため投稿できません。" },
      { status: 400 }
    );
  }

  // ② 個人情報チェック（AIが苦手な部分）
  const personalPatterns = [
    // 電話番号（090-xxxx / 090xxxxxxxx）
    /\b0\d{1,4}-\d{1,4}-\d{3,4}\b/,
    /\b0\d{9,10}\b/,

    // メールアドレス
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,

    // 郵便番号（123-4567）
    /\b\d{3}-\d{4}\b/,
  ];


  if (personalPatterns.some((re) => re.test(text))) {
    return NextResponse.json(
      { error: "個人情報を含む内容は投稿できません。" },
      { status: 400 }
    );
  }
  // ③ Perspective API モデレーション
  const result = await analyzePerspectiveDirect(text);
  console.log("Perspective API result:", result);
  const toxicity =
    result.attributeScores?.TOXICITY?.summaryScore?.value ?? 0;
  const insult =
    result.attributeScores?.INSULT?.summaryScore?.value ?? 0;
  const profanity =
    result.attributeScores?.PROFANITY?.summaryScore?.value ?? 0;

  // 閾値（自由に調整してOK）
  if (toxicity > 0.75 || insult > 0.70 || profanity > 0.65) {
    return NextResponse.json(
      { error: "不適切な表現が含まれているため投稿できません。" },
      { status: 400 }
    );
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