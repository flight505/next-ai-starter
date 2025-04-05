import React from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Metadata } from "next";
import ClientProvider from "@/components/ClientProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeAwareToast } from "@/components/theme/ThemeAwareToast";
import AsciiBackground from "@/components/AsciiBackground";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ASCII Portfolio",
  description: "ASCII art portfolio website",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-green-500 dark:bg-black dark:text-green-500">
        <ThemeProvider defaultTheme="dark" enableSystem>
          <ClientProvider>
            <TRPCReactProvider>
              <AsciiBackground />
              <div className="flex flex-col min-h-screen relative z-10">
                <header className="sticky top-0 z-50 w-full border-b border-green-800 bg-black/80 backdrop-blur-sm">
                  <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="font-mono text-xl font-bold text-green-500">
                        ASCII
                      </span>
                    </Link>
                    <nav className="flex items-center space-x-4">
                      <Link
                        href="/"
                        className="text-sm font-mono text-green-500 hover:text-green-300 transition-colors"
                      >
                        Home
                      </Link>
                      <Link
                        href="/about"
                        className="text-sm font-mono text-green-500 hover:text-green-300 transition-colors"
                      >
                        About
                      </Link>
                      <Link
                        href="/blog"
                        className="text-sm font-mono text-green-500 hover:text-green-300 transition-colors"
                      >
                        Blog
                      </Link>
                      <Link
                        href="/contact"
                        className="text-sm font-mono text-green-500 hover:text-green-300 transition-colors"
                      >
                        Contact
                      </Link>
                    </nav>
                  </div>
                </header>
                <main className="flex-grow relative z-10">{children}</main>
                <footer className="py-4 border-t border-green-800 bg-black text-center text-sm text-green-500">
                  <div className="container mx-auto px-4">
                    &copy; {new Date().getFullYear()} ASCII Portfolio
                  </div>
                </footer>
              </div>
              <ThemeAwareToast />
            </TRPCReactProvider>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
