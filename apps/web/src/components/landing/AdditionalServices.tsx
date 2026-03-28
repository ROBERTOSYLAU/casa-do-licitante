'use client';

import type { LucideIcon } from 'lucide-react';
import { FilePlus2, Fingerprint, BarChart3, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: FilePlus2,
    title: 'Abertura de Empresa',
    description:
      'Abra seu MEI ou empresa LTDA de forma rápida e online com nossos especialistas.',
  },
  {
    icon: Fingerprint,
    title: 'Certificado Digital',
    description:
      'Emita ou renove seu certificado digital sem burocracia, essencial para licitar.',
  },
  {
    icon: BarChart3,
    title: 'Contabilidade Especializada',
    description:
      'Balanço patrimonial e suporte contábil focado em licitantes.',
  },
  {
    icon: Gavel,
    title: 'Suporte Jurídico',
    description:
      'Advogados especializados em licitações para recursos e impugnações.',
  },
];

function ServiceCard({
  icon: Icon,
  title,
  description,
  delay,
}: (typeof services)[0] & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-white/20 text-center flex flex-col items-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/80 mb-6 flex-grow">{description}</p>
      <Button
        onClick={() => toast.info(`${title} em breve`)}
        variant="outline"
        className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 w-full mt-auto"
      >
        Solicitar Serviço
      </Button>
    </motion.div>
  );
}

export default function AdditionalServices() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Serviços que Impulsionam seu Negócio
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Soluções para regularizar e profissionalizar sua empresa no universo
            das licitações.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
