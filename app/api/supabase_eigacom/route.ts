export const runtime = "edge";


import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeEigaComAll } from "../render/route";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_KEY!
// );

const EXPIRE_DAYS = 14;

function normalizeTitle(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

export async function POST(req: Request) {
  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

//   const normalized = normalizeTitle(title);

//   // ① キャッシュ確認
//   const { data: cache } = await supabase
//     .from("eiga_cache")
//     .select("*")
//     .eq("normalized", normalized)
//     .maybeSingle();

//   const now = new Date();

//   // --- キャッシュ存在 & 有効 ---
//   if (cache && new Date(cache.expires_at) > now) {
//     return NextResponse.json({
//       source: "cache",
//       ...cache.items,
//     });
//   }

  // --- キャッシュが無い or 期限切れ → スクレイピング ---
  const scraped = await scrapeEigaComAll(title);

//   const expires = new Date();
//   expires.setDate(expires.getDate() + EXPIRE_DAYS);

//   if (cache) {
//     // 上書き
//     await supabase
//       .from("eiga_cache")
//       .update({
//         items: scraped,
//         updated_at: new Date(),
//         expires_at: expires,
//       })
//       .eq("id", cache.id);
//   } else {
//     // 新規保存
//     await supabase.from("eiga_cache").insert({
//       title,
//       normalized,
//       items: scraped,
//       updated_at: new Date(),
//       expires_at: expires,
//     });
//   }

  return NextResponse.json({
    source: "scrape",
    ...scraped,
  });
}
