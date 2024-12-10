import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { AntMessageProvider } from "~/app/_components/AntMessageProvider";

export const metadata: Metadata = {
  title: "DevTo Clone",
  description: "A place to share knowledge",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <TRPCReactProvider>
          <AntMessageProvider>{children}</AntMessageProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
