import { UserMenu } from './UserMenu';

interface TopbarProps {
  user: {
    name?: string | null;
    email: string;
    role: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shrink-0">
      {/* Left: spacer for mobile hamburger + reserved for future search bar */}
      <div className="flex-1 pl-10 lg:pl-0">
        {/* Search input will slot in here */}
      </div>

      {/* Right: user menu */}
      <UserMenu user={user} />
    </header>
  );
}
