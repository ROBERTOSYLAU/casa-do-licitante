'use client';

import { useEffect, useRef, useState } from 'react';
import { Archive, ChevronRight, GripVertical, Plus, Trash2, Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBRL } from '@/lib/utils';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type FunilStage =
  | 'prospeccao'
  | 'analisando'
  | 'vai_participar'
  | 'em_disputa'
  | 'ganho'
  | 'perdido'
  | 'arquivado';

export interface FunilCard {
  id: string;
  stage: FunilStage;
  objeto: string;
  orgaoNome: string;
  uf: string;
  modalidade: string;
  valorEstimado?: number;
  dataAbertura?: string;
  source: string;
  sourceId: string;
  createdAt: string;
  notes?: string;
}

const STAGES: Array<{ id: FunilStage; label: string; color: string; bg: string; border: string }> = [
  { id: 'prospeccao',    label: 'Prospecção',     color: 'text-slate-300',   bg: 'bg-slate-800/60',   border: 'border-slate-600/40' },
  { id: 'analisando',   label: 'Analisando',      color: 'text-blue-300',    bg: 'bg-blue-900/40',    border: 'border-blue-500/30' },
  { id: 'vai_participar', label: 'Vai Participar', color: 'text-violet-300', bg: 'bg-violet-900/40',  border: 'border-violet-500/30' },
  { id: 'em_disputa',   label: 'Em Disputa',      color: 'text-yellow-300',  bg: 'bg-yellow-900/30',  border: 'border-yellow-500/30' },
  { id: 'ganho',        label: 'Ganho',            color: 'text-emerald-300', bg: 'bg-emerald-900/30', border: 'border-emerald-500/30' },
  { id: 'perdido',      label: 'Perdido',          color: 'text-red-300',     bg: 'bg-red-900/30',     border: 'border-red-500/30' },
];

const STORAGE_KEY = 'casa-funil-v1';

function loadCards(): FunilCard[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as FunilCard[];
  } catch {
    return [];
  }
}

function saveCards(cards: FunilCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// ─── Componente de card individual ────────────────────────────────────────────

function KanbanCard({
  card,
  onMove,
  onDelete,
  onNoteChange,
}: {
  card: FunilCard;
  onMove: (id: string, stage: FunilStage) => void;
  onDelete: (id: string) => void;
  onNoteChange: (id: string, notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [noteText, setNoteText] = useState(card.notes ?? '');
  const stageIdx = STAGES.findIndex((s) => s.id === card.stage);

  return (
    <div
      className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/8 transition-colors group cursor-default"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('cardId', card.id)}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 shrink-0 mt-0.5 text-white/20 group-hover:text-white/40 cursor-grab" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white leading-snug line-clamp-2">{card.objeto}</p>
          <p className="mt-1 text-xs text-white/50 truncate">{card.orgaoNome}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">{card.uf}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60 capitalize">
              {card.modalidade.replaceAll('_', ' ')}
            </span>
            {card.source === 'pncp' && (
              <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300">PNCP</span>
            )}
          </div>
          {card.valorEstimado != null && (
            <p className="mt-2 text-sm font-semibold text-emerald-400">{formatBRL(card.valorEstimado)}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className="shrink-0 rounded p-1 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
          aria-label="Remover"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Mover para próxima etapa */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-white/40 hover:text-white/70 transition"
        >
          {expanded ? 'menos' : 'notas + mover'}
        </button>
        {stageIdx < STAGES.length - 1 && STAGES[stageIdx + 1] && (
          <button
            onClick={() => onMove(card.id, STAGES[stageIdx + 1]!.id)}
            className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            {STAGES[stageIdx + 1]!.label} <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          {/* Mover para qualquer etapa */}
          <div className="flex flex-wrap gap-1">
            {STAGES.filter((s) => s.id !== card.stage).map((s) => (
              <button
                key={s.id}
                onClick={() => onMove(card.id, s.id)}
                className={cn('rounded-full px-2 py-0.5 text-[10px] border transition hover:opacity-100 opacity-70', s.color, s.border, 'bg-white/5')}
              >
                → {s.label}
              </button>
            ))}
          </div>
          {/* Notas */}
          {editing ? (
            <div className="space-y-1.5">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-white/10 border border-white/20 text-white text-xs p-2 placeholder:text-white/30 resize-none focus:outline-none focus:border-blue-400/50"
                placeholder="Notas sobre esta oportunidade..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { onNoteChange(card.id, noteText); setEditing(false); }}
                  className="rounded-full bg-emerald-500/20 border border-emerald-400/20 px-3 py-0.5 text-[10px] text-emerald-300 hover:bg-emerald-500/30 transition"
                >
                  Salvar
                </button>
                <button
                  onClick={() => { setNoteText(card.notes ?? ''); setEditing(false); }}
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-[10px] text-white/50 hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full text-left rounded-lg bg-white/5 border border-dashed border-white/15 p-2 text-[10px] text-white/40 hover:text-white/60 hover:border-white/25 transition"
            >
              {card.notes || '+ Adicionar nota...'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Coluna do Kanban ─────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  cards,
  onDrop,
  onMove,
  onDelete,
  onNoteChange,
}: {
  stage: typeof STAGES[number];
  cards: FunilCard[];
  onDrop: (cardId: string, stage: FunilStage) => void;
  onMove: (id: string, stage: FunilStage) => void;
  onDelete: (id: string) => void;
  onNoteChange: (id: string, notes: string) => void;
}) {
  const [over, setOver] = useState(false);
  const totalValor = cards.reduce((acc, c) => acc + (c.valorEstimado ?? 0), 0);

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border min-w-[240px] w-[240px] shrink-0 transition-colors',
        stage.bg,
        stage.border,
        over && 'ring-2 ring-white/20 scale-[1.01]',
      )}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(e.dataTransfer.getData('cardId'), stage.id); }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div>
          <span className={cn('text-sm font-semibold', stage.color)}>{stage.label}</span>
          <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">{cards.length}</span>
        </div>
        {totalValor > 0 && (
          <span className="text-xs text-emerald-400 font-medium">{formatBRL(totalValor)}</span>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3 max-h-[calc(100vh-280px)] scrollbar-thin">
        {cards.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-white/25">
            Arraste aqui
          </div>
        )}
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onMove={onMove}
            onDelete={onDelete}
            onNoteChange={onNoteChange}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FunilKanban() {
  const [cards, setCards] = useState<FunilCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setLoaded(true);
  }, []);

  function persist(updated: FunilCard[]) {
    setCards(updated);
    saveCards(updated);
  }

  function handleDrop(cardId: string, stage: FunilStage) {
    persist(cards.map((c) => c.id === cardId ? { ...c, stage } : c));
  }

  function handleMove(id: string, stage: FunilStage) {
    persist(cards.map((c) => c.id === id ? { ...c, stage } : c));
  }

  function handleDelete(id: string) {
    persist(cards.filter((c) => c.id !== id));
  }

  function handleNoteChange(id: string, notes: string) {
    persist(cards.map((c) => c.id === id ? { ...c, notes } : c));
  }

  const totalGanho = cards.filter((c) => c.stage === 'ganho').reduce((s, c) => s + (c.valorEstimado ?? 0), 0);
  const totalPipeline = cards
    .filter((c) => !['ganho', 'perdido', 'arquivado'].includes(c.stage))
    .reduce((s, c) => s + (c.valorEstimado ?? 0), 0);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64 text-white/40 text-sm">
        Carregando funil...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Funil de Licitações</h1>
          <p className="mt-1 text-white/60 text-sm">
            Gerencie suas oportunidades por etapa. Arraste os cards entre as colunas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
            <p className="text-xs text-white/40">Pipeline ativo</p>
            <p className="text-lg font-bold text-white">{formatBRL(totalPipeline)}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/20 px-4 py-2 text-center">
            <p className="text-xs text-emerald-400/70 flex items-center gap-1"><Trophy className="h-3 w-3" /> Ganhos</p>
            <p className="text-lg font-bold text-emerald-400">{formatBRL(totalGanho)}</p>
          </div>
        </div>
      </div>

      {cards.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-10 text-center">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-white/20" />
          <h3 className="text-lg font-semibold text-white">Funil vazio</h3>
          <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">
            Vá até <strong className="text-white">Pesquisa de Licitações</strong> e clique em{' '}
            <strong className="text-white">&quot;Adicionar ao Funil&quot;</strong> em qualquer resultado para começar a acompanhar oportunidades aqui.
          </p>
        </div>
      )}

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            cards={cards.filter((c) => c.stage === stage.id)}
            onDrop={handleDrop}
            onMove={handleMove}
            onDelete={handleDelete}
            onNoteChange={handleNoteChange}
          />
        ))}
      </div>

      <p className="text-xs text-white/25 text-center">
        Os dados do funil são salvos localmente no seu navegador.
      </p>
    </div>
  );
}
