'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-3xl p-12 text-center border border-white/20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para Levar Sua Empresa a Outro Nível?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a empresas que confiam na Casa do Licitante para crescer no
            mercado governamental.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => toast.info('Cadastro em breve')}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
            >
              Teste Grátis por 7 Dias
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => toast.info('Contato comercial em breve')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              Falar com um Especialista
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
