'use client';

import { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { signOutAction } from '@/actions/auth';

interface UserMenuProps {
  user: {
    name?: string | null;
    email: string;
    role: string;
  };
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  analyst: 'Analista',
  viewer: 'Visualizador',
};

function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const initials = getInitials(user.name, user.email);
  const displayName = user.name ?? user.email.split('@')[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 select-none">
          {initials}
        </div>

        {/* Name + role — visible on sm+ */}
        <div className="hidden sm:block text-left min-w-0">
          <p className="text-sm font-medium text-slate-200 leading-tight truncate max-w-[128px]">
            {displayName}
          </p>
          <p className="text-xs text-slate-500 leading-tight">
            {ROLE_LABELS[user.role] ?? user.role}
          </p>
        </div>

        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Invisible full-screen backdrop to catch outside clicks */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          {/* Dropdown panel */}
          <div className="absolute right-0 top-full mt-1.5 w-52 z-40 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-sm font-semibold text-slate-100 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
            </div>

            <div className="py-1.5">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
