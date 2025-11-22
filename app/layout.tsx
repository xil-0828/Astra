

import { Providers } from "./components/providers";
import { M_PLUS_1 } from "next/font/google";
import Header from "./components/ui/Header";

// ★部分的に使えるフォント
export const mplus1 = M_PLUS_1({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

// ★ SEO metadata（必ず Server Component 内）
export const metadata = {
  title: "Almond Games",
  description: "ミニゲームポータルサイト Almond Games",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ background: "#f4edf0ff" }}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
