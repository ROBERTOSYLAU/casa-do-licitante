'use client';

// Migrated from horizons-src/src/pages/ToolsPage.jsx
// Each tool is a lazy-loaded accordion section.
import { useState } from 'react';
import { Building2, MapPin, DollarSign, Package } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CnpjSearch from './CnpjSearch';
import CepSearch from './CepSearch';
import CurrencyConverter from './CurrencyConverter';
import TrackingPlaceholder from './TrackingPlaceholder';

const tools = [
  {
    id: 'cnpj',
    label: 'Consulta de CNPJ',
    icon: Building2,
    component: <CnpjSearch />,
  },
  {
    id: 'cep',
    label: 'Consulta de CEP',
    icon: MapPin,
    component: <CepSearch />,
  },
  {
    id: 'currency',
    label: 'Conversor de Moedas',
    icon: DollarSign,
    component: <CurrencyConverter />,
  },
  {
    id: 'tracking',
    label: 'Rastreamento de Encomendas',
    icon: Package,
    component: <TrackingPlaceholder />,
  },
];

export default function ToolsGrid() {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {tools.map((tool) => (
        <AccordionItem
          key={tool.id}
          value={tool.id}
          className="bg-white/5 border border-white/10 rounded-xl px-6"
        >
          <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4">
            <span className="flex items-center gap-3">
              <tool.icon className="h-5 w-5 text-green-400" />
              {tool.label}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6">{tool.component}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
