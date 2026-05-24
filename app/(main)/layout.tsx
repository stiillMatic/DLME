import Navbar from "@/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>Deep Learning for Mechanical Engineers · Built with Next.js &amp; Supabase</p>
      </footer>
    </>
  );
}
