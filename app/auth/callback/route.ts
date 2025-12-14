export const runtime = "edge";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // ✅ 既存の server client を使う
  const supabase = await createClient();

  // 🔑 Auth callback の本体
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${origin}${next}`);
}
