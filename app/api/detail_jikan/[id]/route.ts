export const runtime = "edge";

// app/api/anime/[id]/route.ts
import { NextResponse } from "next/server";
import { toAnimeDetailUI } from "@/utils/transform/animeDetail";
import { JikanAnimeDetail } from "@/types/api/jikan_detail";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ★★★★★ これが必須
  const { id } = await context.params;

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${id}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Jikan" },
        { status: res.status }
      );
    }

    const json: { data: JikanAnimeDetail } = await res.json();

    return NextResponse.json({
      data: toAnimeDetailUI(json.data),
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
