'use client';

import { useState } from 'react';
import { Building2, Search, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatBRL } from '@/lib/utils';

interface EmpresaData {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  cnae_fiscal_descricao: string;
  capital_social: number;
  data_inicio_atividade: string;
  porte?: string;
}

interface EmpresaSalva {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  uf: string;
  municipio: string;
  cnae: string;
  capitalSocial: number;
  situacao: string;
  addedAt: string;
}

const STORAGE_KEY = 'casa-empresas-v1';

function formatCnpj(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function loadEmpresas(): EmpresaSalva[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

function saveEmpresas(e: EmpresaSalva[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(e));
}

function formatDateBR(value: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleDateString('pt-BR');
}

export default function MinhaEmpresaClient() {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmpresaData | null>(null);
  const [error, setError] = useState('');
  const [empresas, setEmpresas] = useState<EmpresaSalva[]>(loadEmpresas);
  const [saved, setSaved] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const raw = cnpj.replace(/\D/g, '');
    if (raw.length !== 14) { setError('Digite um CNPJ válido com 14 dígitos.'); return; }

    setLoading(true);
    setResult(null);
    setError('');
    setSaved(false);

    try {
      const res = await fetch(`/api/ferramentas/cnpj?cnpj=${raw}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro ao consultar CNPJ');
      setResult(data as EmpresaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result) return;
    const nova: EmpresaSalva = {
      cnpj: result.cnpj,
      razaoSocial: result.razao_social,
      nomeFantasia: result.nome_fantasia ?? '',
      uf: result.uf,
      municipio: result.municipio,
      cnae: result.cnae_fiscal_descricao,
      capitalSocial: result.capital_social,
      situacao: result.descricao_situacao_cadastral,
      addedAt: new Date().toISOString(),
    };
    const updated = [nova, ...empresas.filter(e => e.cnpj !== nova.cnpj)];
    saveEmpresas(updated);
    setEmpresas(updated);
    setSaved(true);
  }

  function removeEmpresa(cnpj: string) {
    const updated = empresas.filter(e => e.cnpj !== cnpj);
    saveEmpresas(updated);
    setEmpresas(updated);
  }

  const alreadySaved = result && empresas.some(e => e.cnpj === result.cnpj);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-200 mb-4">
          <Building2 className="h-3.5 w-3.5" />
          Gestão de fornecedor
        </div>
        <h1 className="text-3xl font-bold text-white">Minha Empresa</h1>
        <p className="mt-2 text-white/60">
          Cadastre seu CNPJ para receber alertas personalizados e acompanhar oportunidades relevantes para sua empresa.
        </p>
      </div>

      {/* Busca de CNPJ */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-base font-semibold text-white mb-4">Consultar CNPJ</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <Input
              value={cnpj}
              onChange={e => setCnpj(formatCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
              maxLength={18}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2">{loading ? 'Consultando...' : 'Consultar'}</span>
          </Button>
        </form>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{result.razao_social}</h3>
                {result.nome_fantasia && (
                  <p className="text-white/50 text-sm">{result.nome_fantasia}</p>
                )}
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                result.situacao_cadastral === 2
                  ? 'bg-emerald-500/15 border-emerald-400/20 text-emerald-300'
                  : 'bg-red-500/15 border-red-400/20 text-red-300'
              }`}>
                {result.descricao_situacao_cadastral}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/40 mb-1">CNPJ</p>
                <p className="text-white font-mono">{formatCnpj(result.cnpj)}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/40 mb-1">Localização</p>
                <p className="text-white">{result.municipio}/{result.uf}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/40 mb-1">Atividade Principal</p>
                <p className="text-white text-xs leading-snug">{result.cnae_fiscal_descricao}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/40 mb-1">Capital Social</p>
                <p className="text-white font-semibold">{formatBRL(Math.round(result.capital_social * 100))}</p>
              </div>
              <div className="col-span-2 rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/40 mb-1">Endereço</p>
                <p className="text-white text-sm">
                  {result.logradouro}, {result.numero}{result.complemento ? ` ${result.complemento}` : ''} — {result.bairro}, {result.municipio}/{result.uf} · CEP {result.cep}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {!alreadySaved && !saved && (
                <Button
                  onClick={handleSave}
                  className="bg-violet-500 hover:bg-violet-400 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Salvar esta empresa
                </Button>
              )}
              {(alreadySaved || saved) && (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/20 px-4 py-2 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Empresa salva no perfil
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Empresas salvas */}
      {empresas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Minhas Empresas
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">{empresas.length}</span>
          </h2>
          <div className="space-y-3">
            {empresas.map(emp => (
              <div
                key={emp.cnpj}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{emp.razaoSocial}</h3>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${
                      emp.situacao === 'ATIVA'
                        ? 'bg-emerald-500/15 border-emerald-400/20 text-emerald-300'
                        : 'bg-red-500/15 border-red-400/20 text-red-300'
                    }`}>
                      {emp.situacao}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 font-mono mb-2">{formatCnpj(emp.cnpj)}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-white/50">
                    <span>{emp.municipio}/{emp.uf}</span>
                    <span className="truncate max-w-xs">{emp.cnae}</span>
                    <span>{formatBRL(Math.round(emp.capitalSocial * 100))} capital social</span>
                    <span>salva em {formatDateBR(emp.addedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setCnpj(formatCnpj(emp.cnpj)); }}
                    className="rounded-xl border border-white/15 bg-white/5 p-2 text-white/50 hover:bg-white/10 transition"
                    title="Reconsultar"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeEmpresa(emp.cnpj)}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 p-2 text-red-400/70 hover:bg-red-500/15 hover:text-red-300 transition"
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {empresas.length === 0 && !result && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-10 text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-white/20" />
          <h3 className="text-lg font-semibold text-white">Nenhuma empresa cadastrada</h3>
          <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">
            Consulte seu CNPJ acima e salve sua empresa para receber alertas e acompanhar oportunidades personalizadas.
          </p>
        </div>
      )}
    </div>
  );
}
