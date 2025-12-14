export const runtime = "edge";

import { NextResponse } from "next/server";
import { EigaComItem, EigaComResponse } from "@/types/api/eigacom";

/** 除外したいサービス一覧 */
const EXCLUDE_SERVICES = ["ビデオマーケット", "Google", "TELASA"];

/** 文字正規化（空白除去 + 小文字化 + 全角→半角） */
function normalize(str: string) {
  return str
    .trim()
    .replace(/[！-～]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, "")
    .toLowerCase();
}

function removeDuplicates(items: EigaComItem[]): EigaComItem[] {
  const map = new Map<string, EigaComItem>();

  for (const item of items) {
    const key = `${normalize(item.title)}__${normalize(item.service)}`;
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values());
}

/** 映画.com の「全232件中〜」から総件数を取得 */
function extractTotalCount(html: string): number {
  const match = html.match(/全(\d+)件中/);
  return match ? Number(match[1]) : 0;
}

/** 1ページ分の HTML から作品ブロックを抽出 & フィルタ */
function parseItems(html: string, queryTitle: string): EigaComItem[] {
  const blocks = html.split('<li class="col-s-3">').slice(1);
  const normQuery = normalize(queryTitle);

  return blocks
    .map((block): EigaComItem | null => {
      const title =
        block.match(/<p class="title">([\s\S]*?)<\/p>/)?.[1]?.trim() ?? "";

      const service =
        block.match(/<a class="btn"[^>]*>([\s\S]*?)<\/a>/)?.[1]?.trim() ?? "";

      if (EXCLUDE_SERVICES.some((ex) => service.includes(ex))) return null;

      const diff = Math.abs(normQuery.length - normalize(title).length);
      if (diff >= 8) return null;

      const url =
        block.match(/<a class="btn"[^>]+href="([^"]+)"/)?.[1] ?? "";

      const releaseStr =
        block.match(/<small class="release">([\s\S]*?)<\/small>/)?.[1]?.trim() ??
        "";

      return { title, releaseStr, service, url };
    })
    .filter((v): v is EigaComItem => v !== null);
}


/** 映画.com 全ページスクレイピング */
export async function scrapeEigaComAll(
  title: string
): Promise<EigaComResponse> {
  const base =
    "https://eiga.com/rental/q/?name=" +
    encodeURIComponent(title) +
    "&genre[]=all&site[]=all";

  // 1ページ目を取得
  const firstHtml = await fetch(base, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());

  const total = extractTotalCount(firstHtml);
  const perPage = 20;
  const totalPages = Math.ceil(total / perPage);

  const allItems: EigaComItem[] = [];


  // 1ページ目パース
  allItems.push(...parseItems(firstHtml, title));

  // 2ページ目以降
  for (let page = 2; page <= totalPages; page++) {
    const url = `${base}&page=${page}`;
    const html = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());

    allItems.push(...parseItems(html, title));
  }

  // ★ 重複排除
  const uniqueItems = removeDuplicates(allItems);

  return {
    totalAllResults: total,
    fetchedPages: totalPages,
    countAfterFilter: uniqueItems.length,
    items: uniqueItems,
  };
}
export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const result = await scrapeEigaComAll(title);
    return NextResponse.json(result);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { error: e.message, stack: e.stack },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 }
    );
  }
}
