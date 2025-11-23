// app/api/anime/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=20`);
  const data = await res.json();

  return NextResponse.json(data);
}
