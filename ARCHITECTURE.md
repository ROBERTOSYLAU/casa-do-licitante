# Casa do Licitante  Arquitetura do Sistema

**ltima atualizao:** 2026-04-05
**Responsvel:** Roberto Sylau

---

## O que foi construdo

Sistema de coleta, armazenamento e consulta de licitaes pblicas,
integrando com a API oficial do PNCP (Portal Nacional de Contrataes Pblicas).

---

## Arquitetura atual

```
VPS (Hostinger)
 Docker Engine
    casa-postgres        Banco de dados PostgreSQL (persistente)
    casa-api             API REST Node.js (porta 3001, sempre ativa)
    casa-collector       Coletor PNCP (roda e para, ativado pelo cron)
    casa-web             Frontend Next.js (j existia)
    casa-redis           Cache Redis (j existia)
 cron (VPS)
     */10 * * * *   docker start casa-collector
```

---

## Estrutura de pastas da API

```
/docker/app-casa-do-licitante/api/
 index.js                   Ponto de entrada (modo api ou collect via MODE=)
 package.json
 Dockerfile
 src/
     config/
        index.js           Todas as configuraes centralizadas (env vars)
     db/
        index.js           Pool de conexes pg + migrate() + query()
     services/
        collector.js       Coleta PNCP com paginao, normalizao e log JSON
     routes/
         licitacoes.js      Endpoints REST com filtros e paginao real
```

---

## Banco de dados  tabela licitacoes

| Coluna     | Tipo           | Descrio                        |
|------------|----------------|----------------------------------|
| id         | SERIAL PK      | Chave primria                   |
| orgao      | TEXT           | Razo social do rgo            |
| objeto     | TEXT           | Descrio da licitao           |
| valor      | NUMERIC(18,2)  | Valor total estimado             |
| data       | TIMESTAMP      | Data de abertura de proposta     |
| link       | TEXT UNIQUE    | URL original (evita duplicatas)  |
| uf         | VARCHAR(2)     | Estado (pronto para filtro)      |
| municipio  | TEXT           | Cidade (pronto para filtro)      |
| modalidade | TEXT           | Tipo de licitao                |
| criado_em  | TIMESTAMP      | Data de insero no banco        |

### ndices criados
- `idx_lic_link`     UNIQUE  evita duplicatas
- `idx_lic_objeto`   GIN full-text search em portugus
- `idx_lic_orgao`    busca por rgo
- `idx_lic_valor`    faixa de valor
- `idx_lic_data`     faixa de data
- `idx_lic_uf`       filtro por estado

---

## API REST  Endpoints

### GET /health
Verifica se a API est no ar.

### GET /licitacoes
Lista licitaes com filtros e paginao.

**Parmetros aceitos:**
| Parmetro  | Descrio                             | Exemplo            |
|------------|---------------------------------------|--------------------|
| q          | Busca full-text no objeto             | q=pavimentao     |
| orgao      | Filtra por nome do rgo (parcial)    | orgao=prefeitura   |
| uf         | Filtra por estado (sigla)             | uf=SP              |
| municipio  | Filtra por cidade (parcial)           | municipio=campinas |
| modalidade | Filtra por modalidade (parcial)       | modalidade=prego  |
| valorMin   | Valor mnimo                          | valorMin=10000     |
| valorMax   | Valor mximo                          | valorMax=500000    |
| dataInicio | Data inicial (ISO)                    | dataInicio=2025-01-01 |
| dataFim    | Data final (ISO)                      | dataFim=2025-12-31 |
| page       | Pgina (padro: 1)                    | page=2             |
| limit      | Itens por pgina (max 100, padro 20) | limit=50           |

**Resposta:**
```json
{
  "meta": { "total": 1234, "page": 1, "limit": 20, "totalPages": 62 },
  "data": [ { "id": 1, "orgao": "...", "objeto": "...", ... } ]
}
```

### GET /licitacoes/:id
Retorna uma licitao especfica pelo ID.

---

## Coletor  configurao

Variveis de ambiente (docker-compose ou .env):

| Varivel            | Padro     | Descrio                    |
|---------------------|------------|------------------------------|
| PNCP_DATA_INICIAL   | 20250101   | Data incio da busca         |
| PNCP_DATA_FINAL     | 20251231   | Data fim da busca            |
| PNCP_MODALIDADE     | 5          | Cdigo de modalidade PNCP    |
| PNCP_PAGINA_SIZE    | 50         | Registros por pgina         |
| PNCP_MAX_PAGINAS    | 10         | Mximo de pginas por coleta |

---

## O que j funciona

- [x] Coleta automtica do PNCP a cada 10 minutos
- [x] Anti-duplicao via UNIQUE no link
- [x] Paginao real na coleta (at N pginas configurveis)
- [x] Log estruturado em JSON (nvel info/warn/error)
- [x] API REST com Express rodando permanentemente
- [x] Filtros: full-text, rgo, UF, municpio, modalidade, valor, data
- [x] Paginao real na API (limit + offset)
- [x] ndices no banco para performance
- [x] Migrations automticas ao subir
- [x] Pool de conexes no banco
- [x] Separao de responsabilidades: config / db / services / routes

---

## Prximos passos

### Fase 2  Enriquecimento e inteligncia
- [ ] Expandir coleta para mltiplas modalidades (no s cdigo 5)
- [ ] Preparar estrutura para scraping do ComprasNet
- [ ] Campo `fonte` para identificar origem dos dados
- [ ] Campo `status` para rastrear licitaes abertas/encerradas
- [ ] Sistema de alertas: notificar usurio quando nova licitao bate no perfil

### Fase 3  Frontend e produto
- [ ] Conectar casa-web com casa-api
- [ ] Pgina de busca de licitaes com filtros visuais
- [ ] Pgina de detalhe da licitao
- [ ] Dashboard com estatsticas (valores, rgos, estados)
- [ ] Perfil de monitoramento por palavra-chave

### Fase 4  Escala
- [ ] Rate limiting na API
- [ ] Cache Redis para buscas frequentes
- [ ] Autenticao JWT para endpoints privados
- [ ] Exportao CSV/Excel de resultados
