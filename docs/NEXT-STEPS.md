# Casa do Licitante — Next Steps

**Atualizado em:** domingo, 29/03/2026 às 02:06 (GMT-3)

---

## 1. Norte do produto

O **Casa do Licitante** não deve ser apenas um buscador de licitações.

A direção oficial do produto é ser uma **central operacional de inteligência para licitantes**, cobrindo:
- licitações e acompanhamento de oportunidades
- dados públicos empresariais e cadastrais
- inteligência territorial e municipal
- dados fiscais, patrimoniais e contextuais
- ferramentas úteis para operação comercial e técnica

Regra estratégica definida:
- **fase 1:** usar APIs públicas
- **fase 2:** integrar APIs pagas onde fizer sentido

---

## 2. Estado atual do projeto

### Já feito
- melhoria visual forte da landing
- melhoria do login
- melhoria do dashboard
- detalhe de licitação deixou de ser placeholder e passou a abrir com conteúdo útil
- README reescrito com posicionamento melhor
- build do app web fechado com sucesso
- auth/build estabilizados para beta privado
- componentes UI faltantes criados
- correções de monorepo/export/tipagem
- push feito para `main`

### Situação atual
- o projeto já pode ser tratado como **beta privado apresentável**
- o núcleo do produto existe, mas ainda precisa de aprofundamento funcional e de dados

---

## 3. O que validar em produção

### Deploy VPS
Executar:
```bash
cd /var/www/app-casa-do-licitante
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter @casa/db db:generate
pnpm --filter @casa/web build
pm2 reload ecosystem.config.cjs --env production
sudo systemctl reload nginx
```

### Testes obrigatórios
- abrir `/`
- abrir `/login`
- login funcionando
- redirecionamento para `/dashboard`
- busca em `/licitacoes`
- clique em detalhe de licitação
- API health funcionando
- API de licitações funcionando

---

## 4. Prioridades imediatas

### P0 — estabilização online
- [ ] validar deploy real na VPS
- [ ] validar login em produção
- [ ] validar middleware/autenticação em produção
- [ ] validar busca em produção
- [ ] validar detalhe de licitação em produção
- [ ] revisar logs do PM2/nginx após deploy

### P1 — fortalecer núcleo do produto
- [ ] enriquecer detalhe de licitação
- [ ] melhorar consistência entre busca e detalhe
- [ ] deixar dashboard menos demonstrativo e mais operacional
- [ ] criar watchlist/favoritos
- [ ] melhorar fluxo de busca e filtros

### P2 — consolidar valor comercial
- [ ] score de oportunidade
- [ ] score de risco
- [ ] resumo executivo da licitação
- [ ] recomendação automática de próximos passos

---

## 5. Módulos futuros do produto

### Módulo 1 — Licitações
Base atual e evolução:
- PNCP
- ComprasNet
- DOU
- outras bases públicas relevantes

Objetivo:
- busca
- detalhe
- timeline
- acompanhamento
- alertas

### Módulo 2 — Empresas
Bases públicas previstas:
- BrasilAPI
- CNPJ/CNAE
- dados públicos correlatos

Objetivo:
- consulta de CNPJ
- CNAE principal/secundário
- perfil empresarial
- aderência comercial

### Módulo 3 — Municípios e território
Bases públicas previstas:
- IBGE
- dados territoriais públicos
- bases municipais abertas

Objetivo:
- perfil de município
- inteligência regional
- contexto local
- suporte para operação tributária municipal

### Módulo 4 — Fiscal / patrimonial / arrecadação
Bases públicas previstas:
- CAPAG
- dados de arrecadação pública
- IPTU / ITR / dados territoriais públicos
- dados correlatos para inexigibilidade e contexto técnico

Objetivo:
- leitura institucional e fiscal
- apoio a estudos e diligência
- inteligência de oportunidade pública

### Módulo 5 — Produtos e classificação
Bases públicas previstas:
- NCM
- classificações correlatas

Objetivo:
- cruzar produto ↔ oportunidade
- melhorar busca e aderência

---

## 6. Diferenciais que o produto deve perseguir

Não virar só “mais uma base de edital”.

### Diferenciais desejados
- [ ] score de atratividade comercial
- [ ] score de risco
- [ ] perfil inteligente da empresa
- [ ] inteligência territorial
- [ ] central operacional de acompanhamento
- [ ] leitura executiva da oportunidade
- [ ] cruzamento entre empresa, município, produto e licitação

---

## 7. Ordem ideal de execução

### Sprint 1
- deploy real
- validação online
- ajuste fino pós-produção
- detalhe de licitação mais forte
- dashboard mais útil

### Sprint 2
- CNPJ / CNAE
- IBGE / municípios
- watchlist
- score inicial

### Sprint 3
- CAPAG
- NCM
- cruzamentos inteligentes
- melhoria dos filtros

### Sprint 4
- IPTU / ITR / dados territoriais públicos
- módulos avançados
- contexto para inexigibilidade e inteligência municipal

---

## 8. Riscos para não perder de vista

- desviar para volume sem direção
- adicionar API pública sem utilidade real
- criar muitas telas e pouca inteligência
- perder consistência entre dado, produto e proposta comercial
- virar um catálogo bonito sem profundidade operacional

---

## 9. Próximo passo recomendado quando voltarmos

### Ação imediata
- validar deploy da versão atual na VPS

### Depois
- abrir a próxima rodada focada em:
  1. detalhe de licitação
  2. dashboard real
  3. watchlist
  4. CNPJ/CNAE
  5. IBGE/municípios

---

## 10. Resumo executivo

Estado atual:
- beta privado funcional e apresentável
- base técnica mais sólida
- build web validado

Direção oficial:
- transformar o Casa do Licitante em **central de inteligência pública e operacional para licitantes**

Próxima missão:
- validar produção
- fortalecer núcleo
- integrar módulos públicos com alto impacto
