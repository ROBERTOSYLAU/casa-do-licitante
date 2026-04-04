'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FileSearch,
  GitMerge,
  BarChart3,
  Bell,
  Building2,
  Wrench,
  Scale,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  children?: { href: Route; label: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  {
    href: '/licitacoes',
    label: 'Licitações',
    icon: FileSearch,
    children: [
      { href: '/licitacoes',        label: 'Pesquisar' },
      { href: '/licitacoes/funil',  label: 'Funil (Kanban)' },
    ],
  },
  { href: '/analise',        label: 'Análise',          icon: BarChart3 },
  { href: '/alertas',        label: 'Alertas',          icon: Bell },
  { href: '/minha-empresa',  label: 'Minha Empresa',    icon: Building2 },
  { href: '/juridico',       label: 'Jurídico',         icon: Scale },
  { href: '/ferramentas',    label: 'Ferramentas',      icon: Wrench },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [expanded, setExpanded] = useState<string[]>(['/licitacoes']);

  function toggleExpand(href: string) {
    setExpanded(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  }

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      {NAV_ITEMS.map(({ href, label, icon: Icon, children }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
        const isExpanded = expanded.includes(href);

        if (children) {
          return (
            <div key={href}>
              <button
                onClick={() => toggleExpand(href)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                )}
              >
                <Icon size={17} strokeWidth={1.8} className="shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isExpanded
                  ? <ChevronDown size={14} className="shrink-0 opacity-50" />
                  : <ChevronRight size={14} className="shrink-0 opacity-50" />
                }
              </button>
              {isExpanded && (
                <div className="ml-8 mt-0.5 space-y-0.5">
                  {children.map(child => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                          childActive
                            ? 'bg-blue-600/10 text-blue-300'
                            : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200',
                        )}
                      >
                        <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
              isActive
                ? 'bg-blue-600/15 text-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
            )}
          >
            <Icon size={17} strokeWidth={1.8} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
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
        <span className="text-xs text-slate-700 font-mono">v0.2 · Beta</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: hamburger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="lg:hidden fixed top-[18px] left-4 z-50 flex items-center justify-center w-9 h-9 rounded-md bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={18} />
      </button>

      {/* Mobile: backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile: slide-in */}
      <aside className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
          className="absolute top-[18px] right-4 p-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <X size={17} />
        </button>
        <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {/* Desktop: fixed */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-60 bg-slate-900 border-r border-slate-800">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
