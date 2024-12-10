import { Navbar } from "~/app/_components/Navbar";

export default function WithNavbarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
