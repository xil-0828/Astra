import wakarase from "../content/wakarase";

export const games = {
  "mesugaki-wakarase-tap": {
    slug: "mesugaki-wakarase-tap", // ← ここ修正しないと404になる
    title: "メスガキわからせタップ",
    date: "2025/11/15",
    thumbnail: "/images/thumbnail/wakarase-tap1.webp",
    description: "メスガキをタップしてわからせるドSゲーム。",
    Content: wakarase,        // ★追加
  },

  "neko-punch-rush": {
    slug: "neko-punch-rush",
    title: "ネコパンチRUSH",
    date: "2025/11/20",
    thumbnail: "/images/thumbnail/wakarase-tap1.webp",
    description: "迫り来る敵をネコパンチで撃破する爽快ミニゲーム。",
    Content: wakarase,   // ★追加
  },

  "gal-sleep-press": {
    slug: "gal-sleep-press",
    title: "ギャル睡眠圧迫PRESS",
    date: "2025/12/01",
    thumbnail: "/images/thumbnail/wakarase-tap1.webp",
    description: "寝てるギャルの上に物を積んでいくシュールゲーム。",
    Content: wakarase,   // ★追加
  },
} as const;

export type GameData = typeof games[keyof typeof games];