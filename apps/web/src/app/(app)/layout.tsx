import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/nav/Sidebar';
import { Topbar } from '@/components/nav/Topbar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar />

      {/* Main content area — pushed right of sidebar on desktop */}
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-60">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
