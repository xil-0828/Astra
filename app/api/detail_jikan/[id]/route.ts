
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ★★★★★ これが必須
  const { id } = await context.params;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Jikan" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const a = json.data;

    return NextResponse.json({
  mal_id: a.mal_id,
  url: a.url, // MALの作品ページ

  // titles
  title: a.title,
  title_english: a.title_english,
  title_japanese: a.title_japanese,
  titles: a.titles, // 全タイトル

  // images
  image:
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    "",
  image_preview:
    a.images?.webp?.image_url ||
    a.images?.jpg?.image_url ||
    "",

  // story
  synopsis: a.synopsis,

  // episodes info
  episodes: a.episodes,
  duration: a.duration, // 例 "24 min per ep"

  // broadcast info
  year: a.year,
  aired_from: a.aired?.from,
  aired_to: a.aired?.to,
  status: a.status, // Finished Airing, Currently Airing など

  // score info
  score: a.score,
  scored_by: a.scored_by,
  rank: a.rank,
  popularity: a.popularity,

  // genres
  genres: a.genres?.map((g) => g.name) || [],

  // studios
  studios: a.studios?.map((s) => s.name) || [],

  // trailer (YouTube)
  trailer: a.trailer?.url || "",
  youtube_id: a.trailer?.youtube_id || "",
});

  } catch (e) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
