import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { AntMessageProvider } from "~/app/_components/AntMessageProvider";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <AntMessageProvider>{children}</AntMessageProvider>
    </TRPCReactProvider>
  );
}
