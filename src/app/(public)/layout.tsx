import { Navbar } from "~/app/_components/Navbar";
import { AppFooter } from "~/app/_components/Footer";
export default function WithNavbarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <AppFooter />
    </>
  );
}
