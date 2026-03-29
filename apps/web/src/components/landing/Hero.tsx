'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, BellRing, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const proofPoints = [
  { label: 'Busca unificada', value: 'PNCP + ComprasNet' },
  { label: 'Leitura comercial', value: 'menos ruído, mais decisão' },
  { label: 'Operação escalável', value: 'monorepo + worker + VPS' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_35%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Plataforma de inteligência comercial para licitações
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-6 text-5xl md:text-7xl font-bold text-white leading-tight"
            >
              Licitação boa não se caça no escuro.{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Você opera com vantagem.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 max-w-3xl text-lg md:text-xl text-white/80 leading-8"
            >
              Centralize busca, compare oportunidades, acompanhe alertas e transforme dados públicos em ação comercial objetiva.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 text-lg">
                <Link href="/licitacoes">
                  Explorar oportunidades
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                <Link href="/login">Acessar painel</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          >
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-sm text-white/50">{item.label}</p>
                  <div className="mt-2 text-white font-semibold leading-snug">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                <div className="flex items-center gap-2 text-white font-medium">
                  <FileSearch className="h-4 w-4 text-cyan-300" />
                  Busca com contexto
                </div>
                <p className="mt-3 text-sm text-white/65">
                  Filtre por palavra-chave, UF, modalidade e fonte para reduzir ruído operacional.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                <div className="flex items-center gap-2 text-white font-medium">
                  <BellRing className="h-4 w-4 text-emerald-300" />
                  Prioridade comercial
                </div>
                <p className="mt-3 text-sm text-white/65">
                  Construa rotina de acompanhamento focada em oportunidades com aderência real ao negócio.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
