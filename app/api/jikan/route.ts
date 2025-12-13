import { NextResponse } from "next/server";
import {
  JikanAnimeSearchResponse,
} from "@/types/api/jikan_anime_search";
import { AnimeSearchUI } from "@/types/ui/anime_search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let q = searchParams.get("q") ?? "";

  if (q.length > 50) q = q.slice(0, 50);

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&sfw=true&order_by=popularity&limit=20`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Jikan" },
        { status: res.status }
      );
    }

    const json: JikanAnimeSearchResponse = await res.json();

    const slim: AnimeSearchUI[] = json.data.map((item) => ({
      id: item.mal_id,
      title: item.title_japanese || item.title,
      imageUrl:
        item.images?.webp?.image_url ||
        item.images?.jpg?.image_url ||
        "",
      episodes: item.episodes ?? null,
      genres: item.genres?.map((g) => g.name) ?? [],
    }));

    return NextResponse.json({ data: slim });

  } catch {
    return NextResponse.json(
      { error: "Server error fetching Jikan API" },
      { status: 500 }
    );
  }
}
