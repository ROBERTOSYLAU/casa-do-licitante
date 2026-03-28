'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Observador',
    price: 'R$ 49',
    description: 'Para quem está começando.',
    features: [
      'Pesquisa básica de licitações',
      'Acesso a materiais educativos',
      'Suporte por email',
    ],
    buttonClass:
      'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
  },
  {
    name: 'Executor',
    price: 'R$ 149',
    description: 'Para quem participa ativamente.',
    features: [
      'Tudo do plano Observador',
      'Pesquisa avançada e alertas',
      'Gestão de contratos',
      'Painel de fornecedores',
      'Alertas por WhatsApp',
    ],
    buttonClass:
      'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600',
    popular: true,
  },
  {
    name: 'Estratégico',
    price: 'R$ 399',
    description: 'Para empresas que buscam escala.',
    features: [
      'Tudo do plano Executor',
      'Multi-usuários ilimitados',
      'API de integração',
      'Gerente de conta dedicado',
      'SLA garantido',
    ],
    buttonClass:
      'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
  },
];

function PricingCard({
  plan,
  delay,
}: {
  plan: (typeof plans)[0];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border hover:scale-105 transition-all duration-300 flex flex-col ${
        plan.popular ? 'border-2 border-green-400' : 'border-white/20'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-bold">
            MAIS POPULAR
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-white mb-2">
          {plan.price}
          <span className="text-lg text-white/60">/mês</span>
        </div>
        <p className="text-white/80">{plan.description}</p>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start text-white/90">
            <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() =>
          toast.info(`Assinatura do plano ${plan.name} em breve`, {
            description: 'Pagamentos via Stripe serão habilitados em breve.',
          })
        }
        className={`w-full mt-auto ${plan.buttonClass}`}
      >
        Escolher Plano
      </Button>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="planos" className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Planos para Cada Perfil
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta à sua jornada no mundo das
            licitações.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
