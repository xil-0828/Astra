import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const searchUrl =
      "https://eiga.com/rental/q/?name=" + encodeURIComponent(title);

    const html = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    }).then((r) => r.text());

    // -------------------------------------
    // ① ブロック抽出
    // -------------------------------------
    const blocks = html.split('<li class="col-s-3">').slice(1);

    if (blocks.length === 0) {
      return NextResponse.json({
        searchTitle: title,
        found: false,
        services: {},
        searchUrl,
      });
    }

    // -------------------------------------
    // ② ブロック → アイテム配列へ抽出
    // -------------------------------------
    const items = blocks.map((block) => {
      // タイトル
      const tMatch = block.match(/<p class="title">([\s\S]*?)<\/p>/);
      const resultTitle = tMatch ? tMatch[1].trim() : "";

      // 配信開始日（例：2025年6月28日配信開始）
      const rMatch = block.match(/<small class="release">([\s\S]*?)<\/small>/);
      const releaseStr = rMatch ? rMatch[1].trim() : "";

      // -------------------------------------
      // releaseStr → releaseDate (YYYY-MM-DD)
      // -------------------------------------
      let releaseDate = "";
      {
        const y = releaseStr.match(/(\d+)年/)?.[1];
        const m = releaseStr.match(/(\d+)月/)?.[1];
        const d = releaseStr.match(/(\d+)日/)?.[1];

        if (y && m && d) {
          releaseDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
      }

      // サービス名
      const sMatch = block.match(/<a class="btn"[^>]*>([\s\S]*?)<\/a>/);
      const service = sMatch ? sMatch[1].trim() : "";

      // URL
      const urlMatch = block.match(/<a class="btn"[^>]+href="([^"]+)"/);
      const serviceUrl = urlMatch ? urlMatch[1] : "";

      return {
        title: resultTitle,
        releaseStr,
        releaseDate,
        service,
        serviceUrl,
      };
    });

    // -------------------------------------
    // ③ サービスごとに最新1件を抽出（A＋C）
    // -------------------------------------
    const latestByService: Record<
      string,
      { release: string; releaseDate: string; url: string }
    > = {};

    for (const item of items) {
      const s = item.service;
      if (!s) continue;

      // 初回登録
      if (!latestByService[s]) {
        latestByService[s] = {
          release: item.releaseStr,
          releaseDate: item.releaseDate,
          url: item.serviceUrl,
        };
        continue;
      }

      // releaseDate が新しければ上書き
      if (item.releaseDate > latestByService[s].releaseDate) {
        latestByService[s] = {
          release: item.releaseStr,
          releaseDate: item.releaseDate,
          url: item.serviceUrl,
        };
      }
    }

    return NextResponse.json({
      searchTitle: title,
      found: true,
      services: latestByService,
      searchUrl,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
