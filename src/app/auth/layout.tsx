import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { AntMessageProvider } from "~/app/_components/AntMessageProvider";
import { AntThemeProvider } from "~/app/_components/AntPublicThemeProvider";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <AntThemeProvider>
        <AntMessageProvider>{children}</AntMessageProvider>
      </AntThemeProvider>
    </TRPCReactProvider>
  );
}
