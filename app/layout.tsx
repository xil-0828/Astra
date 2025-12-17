import { Providers } from "./components/providers";
import localFont from "next/font/local";
import Header from "./components/ui/Header";
import { Toaster } from "@/app/components/ui/toaster";
// ★ フォントの読み込み
export const mplus = localFont({
  src: [
    { path: "../fonts/MPLUS1-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/MPLUS1-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/MPLUS1-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mplus",
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
      <body className={mplus.className} style={{ background: "white" }}>
        <Providers>
          <Header />
          {children}
          <Toaster />   {/* ← これが必須！！ */}
        </Providers>
      </body>
    </html>
  );
}
