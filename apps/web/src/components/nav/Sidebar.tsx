'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FileSearch,
  FileCheck2,
  Building2,
  Wrench,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/licitacoes',   label: 'Licitações',   icon: FileSearch      },
  { href: '/contratos',    label: 'Contratos',    icon: FileCheck2      },
  { href: '/fornecedores', label: 'Fornecedores', icon: Building2       },
  { href: '/ferramentas',  label: 'Ferramentas',  icon: Wrench          },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
              active
                ? 'bg-blue-600/15 text-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
            ].join(' ')}
          >
            <Icon size={17} strokeWidth={1.8} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-slate-800 shrink-0">
        <span className="text-base font-bold tracking-tight text-white select-none">
          Casa do <span className="text-blue-400">Licitante</span>
        </span>
      </div>

      <NavLinks pathname={pathname} onNavigate={onNavigate} />

      {/* Version footer */}
      <div className="px-5 py-4 border-t border-slate-800 shrink-0">
        <span className="text-xs text-slate-700 font-mono">v0.1 · MVP</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: hamburger button (sits above topbar area) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="lg:hidden fixed top-[18px] left-4 z-50 flex items-center justify-center w-9 h-9 rounded-md bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={18} />
      </button>

      {/* Mobile: darkened backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile: slide-in panel */}
      <aside
        className={[
          'lg:hidden fixed inset-y-0 left-0 z-50 w-60',
          'bg-slate-900 border-r border-slate-800',
          'transform transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
          className="absolute top-[18px] right-4 p-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <X size={17} />
        </button>
        <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-60 bg-slate-900 border-r border-slate-800">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
