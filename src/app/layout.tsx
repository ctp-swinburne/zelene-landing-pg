import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { AntMessageProvider } from "~/app/_components/AntMessageProvider";

export const metadata: Metadata = {
  title: "Zelene - Sustainable Solutions",
  description: "Empowering sustainable solutions for a better tomorrow",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen bg-white">
        <TRPCReactProvider>
          <SessionProvider>
            <AntMessageProvider>{children}</AntMessageProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
