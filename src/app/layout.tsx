import React from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Metadata } from "next";
import ClientProvider from "@/components/ClientProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeAwareToast } from "@/components/theme/ThemeAwareToast";
import AsciiBackground from "@/components/AsciiBackground";
import AsciiOverlay from "@/components/AsciiOverlay";

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
                <AsciiOverlay />
                <main className="flex-grow relative z-10 pl-4 md:pl-64">
                  {children}
                </main>
              </div>
              <ThemeAwareToast />
            </TRPCReactProvider>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
