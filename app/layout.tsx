import { Providers } from "./components/providers";
import { M_PLUS_1 } from "next/font/google";
import Header from "./components/ui/Header";

// ★ フォントの読み込み
export const mplus1 = M_PLUS_1({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

// ★ SEO metadata
export const metadata = {
  title: "Astra",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      {/* ➤ フォントを body に適用 */}
      <body className={mplus1.className} style={{ background: "white" }}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
