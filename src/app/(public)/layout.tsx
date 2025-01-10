"use client";

import { Navbar } from "~/app/_components/Navbar";
import { AppFooter } from "~/app/_components/Footer";
import { AntThemeProvider } from "~/app/_components/AntPublicThemeProvider";

export default function WithNavbarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AntThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <AppFooter />
      </div>
    </AntThemeProvider>
  );
}
