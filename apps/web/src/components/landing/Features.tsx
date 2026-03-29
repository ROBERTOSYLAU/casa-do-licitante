'use client';

import Link from 'next/link';
import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  Store,
  FolderKanban,
  Users,
  Warehouse,
  BrainCircuit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: Route;
}[] = [
  {
    icon: Search,
    title: 'Pesquisa Avançada',
    description:
      'Filtros poderosos por órgão, valor, modalidade e alertas automáticos para encontrar a licitação certa.',
    link: '/licitacoes',
  },
  {
    icon: FolderKanban,
    title: 'Gestão de Contratos',
    description:
      'Acompanhe vigências, aditamentos e receba alertas de vencimento com 30, 15 e 7 dias de antecedência.',
    link: '/contratos',
  },
  {
    icon: Store,
    title: 'Painel de Fornecedores',
    description:
      'Certidões, SICAF, sanções (CEIS/CNEP) e habilitação em um único lugar.',
    link: '/fornecedores',
  },
  {
    icon: Users,
    title: 'Multi-Usuários',
    description:
      'Gerencie equipes com papéis admin, analista e visualizador dentro da mesma organização.',
  },
  {
    icon: Warehouse,
    title: 'Integrações Gov',
    description:
      'Dados em tempo real do PNCP, ComprasNet, Receita Federal e portais estaduais.',
  },
  {
    icon: BrainCircuit,
    title: 'Automação e Alertas',
    description:
      'Receba notificações por e-mail e WhatsApp sobre novas licitações que correspondam ao seu perfil.',
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
  link,
}: (typeof features)[0] & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/80 flex-grow mb-6">{description}</p>
      {link && (
        <Button
          asChild
          variant="outline"
          className="w-full border-green-400/50 text-green-400 hover:bg-green-400/10 mt-auto"
        >
          <Link href={link}>Explorar</Link>
        </Button>
      )}
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="funcionalidades" className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Uma Plataforma, Todas as Soluções
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Desde a prospecção até a execução, a Casa do Licitante oferece as
            ferramentas que sua empresa precisa para crescer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
