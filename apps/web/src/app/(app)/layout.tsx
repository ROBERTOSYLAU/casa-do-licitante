// Auth-protected shell. NextAuth session guard will be added here.
// For now this is a structural placeholder.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* TODO: add sidebar + top nav once auth is wired */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
