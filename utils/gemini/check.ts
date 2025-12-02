import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// 6つのサービスの検索URL
const SERVICE_URLS = {
  danime: (title: string) =>
    `https://animestore.docomo.ne.jp/animestore/ci_pc?searchText=${encodeURIComponent(title)}`,
  abema: (title: string) =>
    `https://abema.tv/search?q=${encodeURIComponent(title)}`,
  netflix: (title: string) =>
    `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  prime: (title: string) =>
    `https://www.amazon.co.jp/s?k=${encodeURIComponent(title)}&i=instant-video`,
  unext: (title: string) =>
    `https://video.unext.jp/browse#?query=${encodeURIComponent(title)}`,
  dmmtv: (title: string) =>
    `https://tv.dmm.com/search/?q=${encodeURIComponent(title)}`,
};

// HTML取得
async function fetchHTML(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    return await res.text();
  } catch {
    return "";
  }
}

// AIで判定（公式SDK形式）
async function checkByAI(title: string, html: string) {
  if (!html || html.length < 50) return false;

  const prompt = `
以下のHTMLを読み、アニメ「${title}」が配信中か判断してください。

条件:
- 「見放題」「配信中」「レンタル」などの文言があれば true
- 該当作品が無ければ false

出力は true または false の1語のみ。

HTML:
${html}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text().trim().toLowerCase();

  return text.includes("true");
}

// メイン処理
export async function checkStreamingStatus(title: string) {
  const results: any = {};

  for (const key of Object.keys(SERVICE_URLS)) {
    const url = SERVICE_URLS[key as keyof typeof SERVICE_URLS](title);
    const html = await fetchHTML(url);

    const isAvailable = await checkByAI(title, html);

    results[key] = {
      available: isAvailable,
      url,
    };
  }

  return results;
}
