'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing, Plus, Trash2, Mail, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UF_LIST, MODALIDADE_LIST } from '@casa/domain';

interface Alerta {
  id: string;
  keywords: string[];
  uf: string;
  modalidade: string;
  canal: 'email' | 'whatsapp';
  digest: 'realtime' | 'daily' | 'weekly';
  ativo: boolean;
  criadoEm: string;
}

const STORAGE_KEY = 'casa-alertas-v1';

function loadAlertas(): Alerta[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

function saveAlertas(a: Alerta[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
}

const DIGEST_LABELS = { realtime: 'Tempo real', daily: 'Diário', weekly: 'Semanal' };
const CANAL_ICONS = { email: Mail, whatsapp: MessageSquare };

export default function AlertasClient() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [keywordsRaw, setKeywordsRaw] = useState('');
  const [uf, setUf] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [canal, setCanal] = useState<'email' | 'whatsapp'>('email');
  const [digest, setDigest] = useState<'realtime' | 'daily' | 'weekly'>('daily');

  useEffect(() => { setAlertas(loadAlertas()); setLoaded(true); }, []);

  function persist(updated: Alerta[]) { setAlertas(updated); saveAlertas(updated); }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const keywords = keywordsRaw.split(/[;,]+/).map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0 && !uf && !modalidade) return;

    const novo: Alerta = {
      id: crypto.randomUUID(),
      keywords,
      uf,
      modalidade,
      canal,
      digest,
      ativo: true,
      criadoEm: new Date().toISOString(),
    };
    persist([novo, ...alertas]);
    setKeywordsRaw('');
    setUf('');
    setModalidade('');
    setShowForm(false);
  }

  function toggleAtivo(id: string) {
    persist(alertas.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
  }

  function deleteAlerta(id: string) {
    persist(alertas.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-yellow-200 mb-4">
            <BellRing className="h-3.5 w-3.5" />
            Monitoramento inteligente
          </div>
          <h1 className="text-3xl font-bold text-white">Alertas de Licitações</h1>
          <p className="mt-2 text-white/60">
            Configure alertas e receba notificações quando surgirem oportunidades relevantes.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo alerta
        </Button>
      </div>

      {/* Formulário de criação */}
      {showForm && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-900/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Configurar novo alerta</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <Label className="text-white/80">Palavras-chave <span className="text-white/40">(separadas por vírgula ou ponto e vírgula)</span></Label>
              <Input
                value={keywordsRaw}
                onChange={e => setKeywordsRaw(e.target.value)}
                placeholder="Ex: medicamento, equipamento hospitalar, informática"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 mt-1"
              />
              {keywordsRaw && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {keywordsRaw.split(/[;,]+/).map(k => k.trim()).filter(Boolean).map(k => (
                    <span key={k} className="rounded-full bg-yellow-500/15 border border-yellow-400/20 px-2.5 py-0.5 text-xs text-yellow-200">{k}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Estado (UF)</Label>
                <Select onValueChange={setUf} value={uf}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                    <SelectValue placeholder="Todos os estados" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700 max-h-64">
                    {UF_LIST.map(u => (
                      <SelectItem key={u.sigla} value={u.sigla}>{u.sigla} — {u.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/80">Modalidade</Label>
                <Select onValueChange={setModalidade} value={modalidade}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700 max-h-64">
                    {MODALIDADE_LIST.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Canal de notificação</Label>
                <div className="mt-2 flex gap-2">
                  {(['email', 'whatsapp'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCanal(c)}
                      className={`flex-1 rounded-xl border py-2.5 text-sm transition ${
                        canal === c
                          ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-200'
                          : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {c === 'email' ? '📧 E-mail' : '📱 WhatsApp'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-white/80">Frequência</Label>
                <div className="mt-2 flex gap-2">
                  {(['daily', 'realtime', 'weekly'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDigest(d)}
                      className={`flex-1 rounded-xl border py-2.5 text-xs transition ${
                        digest === d
                          ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-200'
                          : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {DIGEST_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
                <Bell className="mr-2 h-4 w-4" />
                Criar alerta
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-white/20 text-white/70 hover:bg-white/10">
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de alertas */}
      {loaded && alertas.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-12 text-center">
          <Bell className="mx-auto mb-4 h-10 w-10 text-white/20" />
          <h3 className="text-lg font-semibold text-white">Nenhum alerta configurado</h3>
          <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">
            Crie alertas para receber notificações automáticas quando surgirem licitações com os critérios que você definir.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar primeiro alerta
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {alertas.map(alerta => {
          const Icon = CANAL_ICONS[alerta.canal];
          return (
            <div
              key={alerta.id}
              className={`rounded-2xl border p-5 transition-colors ${
                alerta.ativo
                  ? 'border-white/10 bg-white/5'
                  : 'border-white/5 bg-white/2 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {alerta.ativo
                      ? <span className="rounded-full bg-green-500/15 border border-green-400/20 px-2.5 py-0.5 text-xs text-green-300">Ativo</span>
                      : <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/40">Pausado</span>
                    }
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-white/50">
                      <Icon className="h-3 w-3" />
                      {alerta.canal === 'email' ? 'E-mail' : 'WhatsApp'} · {DIGEST_LABELS[alerta.digest]}
                    </span>
                  </div>

                  {alerta.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Search className="h-3.5 w-3.5 text-white/30 mt-0.5 shrink-0" />
                      {alerta.keywords.map(k => (
                        <span key={k} className="rounded-full bg-yellow-500/10 border border-yellow-400/15 px-2 py-0.5 text-xs text-yellow-200">{k}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-white/40">
                    {alerta.uf && <span>UF: <strong className="text-white/60">{alerta.uf}</strong></span>}
                    {alerta.modalidade && (
                      <span>Modalidade: <strong className="text-white/60">
                        {MODALIDADE_LIST.find(m => m.id === alerta.modalidade)?.label ?? alerta.modalidade}
                      </strong></span>
                    )}
                    <span>Criado em {new Date(alerta.criadoEm).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAtivo(alerta.id)}
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 transition"
                  >
                    {alerta.ativo ? 'Pausar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => deleteAlerta(alerta.id)}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 p-1.5 text-red-400/70 hover:bg-red-500/15 hover:text-red-300 transition"
                    aria-label="Excluir alerta"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-blue-500/15 bg-blue-900/10 p-5">
        <h3 className="text-sm font-semibold text-blue-200 mb-2">Sobre os alertas</h3>
        <p className="text-xs text-blue-300/70 leading-relaxed">
          Os alertas são configurados localmente e serão integrados ao sistema de notificações por e-mail e WhatsApp assim que as integrações de envio estiverem ativas (Resend para e-mail, WhatsApp Business API). As configurações ficam salvas no seu perfil.
        </p>
      </div>
    </div>
  );
}
