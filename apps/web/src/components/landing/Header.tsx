'use client';

import Link from 'next/link';
import { Briefcase, Wrench, Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function Header() {
  const stub = (label: string) =>
    toast.info(`${label} em breve`, {
      description: 'Esta funcionalidade está sendo desenvolvida.',
    });

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white tracking-tighter">
              CASA DO LICITANTE
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/licitacoes"
              className="text-white/80 hover:text-white transition-colors flex items-center"
            >
              Oportunidades <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/contratos"
              className="text-white/80 hover:text-white transition-colors flex items-center"
            >
              Contratos <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/fornecedores"
              className="text-white/80 hover:text-white transition-colors flex items-center"
            >
              Fornecedores <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => stub('Notificações')}
              className="relative text-white/80 hover:text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </Button>

            <Link href="/ferramentas">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Wrench className="h-5 w-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/10 px-3"
                >
                  <User className="h-5 w-5" />
                  <span>Conta</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 text-white border-white/20 w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => stub('Configurações')}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => stub('Assinatura')}>
                  Assinatura
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onSelect={() => stub('Sair')}
                  className="text-red-400 focus:text-red-400"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
