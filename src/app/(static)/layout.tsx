import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function StaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 mx-auto max-w-3xl px-4 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
