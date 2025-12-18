import { Providers } from "./components/providers";
import localFont from "next/font/local";
import Header from "./components/ui/Header";
import { Toaster } from "@/app/components/ui/toaster";
// ★ フォントの読み込み
export const mplus = localFont({
  src: [
    {
      path: "../fonts/MPLUS1-VariableFont_wght.ttf",
      weight: "100 900",   // ← Variable Font の指定
      style: "normal",
    },
  ],
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
      <body className={mplus.className} style={{ background: "white", WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",}} >
        <Providers>
          <Header />
          {children}
          <Toaster />   {/* ← これが必須！！ */}
        </Providers>
      </body>
    </html>
  );
}
