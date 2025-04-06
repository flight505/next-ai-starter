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
      <body className="min-h-screen bg-background text-foreground dark:bg-background dark:text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientProvider>
            <TRPCReactProvider>
              <AsciiBackground />
              <div className="flex flex-col min-h-screen relative z-10">
                <AsciiOverlay>
                  <main className="relative z-10 mt-8">
                    {children}
                  </main>
                </AsciiOverlay>
              </div>
              <ThemeAwareToast />
            </TRPCReactProvider>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
