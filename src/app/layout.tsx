import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/Toaster";
import { PageTitle } from "@/components/PageTitle";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "先行 | 作品展示平台",
  description: "发现和分享创意作品",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${notoSansSC.variable} antialiased transition-colors`}
    >
      <body className="flex min-h-screen bg-background text-foreground transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <PageTitle />
            <Sidebar />
            <main className="flex-1 pt-14 md:ml-56 md:pt-0">
              <PageTransition>{children}</PageTransition>
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
