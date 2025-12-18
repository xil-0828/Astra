import { Providers } from "./components/providers";
import localFont from "next/font/local";
import Header from "./components/ui/Header/Header";
import Sidebar from "./components/ui/Sidebar/Sidebar";
import { Toaster } from "@/app/components/ui/toaster";
import { Box, HStack, VStack } from "@chakra-ui/react";

export const mplus = localFont({
  src: [
    {
      path: "../fonts/MPLUS1-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata = {
  title: "Astra",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={mplus.className}
        style={{
          background: "white",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Providers>
          <HStack align="start" gap={0}>
            {/* Sidebar：sticky で見た目固定 */}
            <Box position="sticky" top="0" alignSelf="flex-start">
              <Sidebar />
            </Box>

            {/* Main */}

            <VStack align="stretch" flex="1" minW={0} gap={0}>
              {/* Header：sticky */}
              <Box position="sticky" top="0" zIndex={10} bg="white">
                <Header />
              </Box>
                {children}

            </VStack>
          </HStack>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
