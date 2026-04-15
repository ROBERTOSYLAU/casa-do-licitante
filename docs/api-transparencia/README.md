# Portal da Transparência — API de Dados

**Token de acesso:** `ff13bceda2d057de054c04deefe444d3`  
**Header:** `chave-api-dados: <token>`  
**Base URL:** `https://api.portaldatransparencia.gov.br/api-de-dados`  
**Documentação oficial:** `https://api.portaldatransparencia.gov.br/swagger-ui.html`

---

## ⚠️ Limitação crítica — Licitações

O endpoint `/licitacoes` **exige** o parâmetro `codigoOrgao` (código SIAFI do órgão), tornando-o **inadequado para busca geral** de licitações. Ele serve para consultar licitações de um órgão específico.

**Use ComprasNet (`dadosabertos.compras.gov.br`) ou PNCP para buscas gerais.**

---

## Endpoint: Licitações

```
GET /api-de-dados/licitacoes
```

### Parâmetros obrigatórios
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `codigoOrgao` | string | Código SIAFI do órgão |

### Parâmetros opcionais
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `dataInicial` | string | Data inicial (dd/MM/yyyy) |
| `dataFinal` | string | Data final (dd/MM/yyyy) |
| `pagina` | int | Página de resultados |

### Exemplo de uso
```bash
curl -H "chave-api-dados: ff13bceda2d057de054c04deefe444d3" \
  "https://api.portaldatransparencia.gov.br/api-de-dados/licitacoes?codigoOrgao=26246&dataInicial=01/01/2024&dataFinal=31/12/2024&pagina=1"
```

---

## Outros endpoints úteis

### Contratos
```
GET /api-de-dados/contratos
```
Parâmetros: `codigoOrgao`, `dataInicial`, `dataFinal`, `pagina`

### Órgãos (para obter codigoOrgao)
```
GET /api-de-dados/orgaos-siafi
```
Parâmetros: `codigo`, `descricao`, `pagina`

### Servidores
```
GET /api-de-dados/servidores
```

### Gastos por cartão de pagamento
```
GET /api-de-dados/cartoes
```

---

## Uso potencial no projeto

- **Pesquisa por órgão específico**: quando o usuário quiser ver todas as licitações de um determinado órgão federal (ex: Ministério da Saúde — código 36000)
- **Detalhe de contrato**: ao exibir detalhes de uma licitação encontrada via PNCP/ComprasNet, buscar contrato relacionado via código do órgão
- **Futuro módulo "Órgãos"**: listar órgãos federais e suas licitações recentes

---

## Códigos SIAFI comuns

| Órgão | Código SIAFI |
|-------|-------------|
| Ministério da Saúde | 36000 |
| Ministério da Educação | 26000 |
| Ministério da Defesa | 52000 |
| FNDE | 26298 |
| INSS | 36201 |

> Consulte a lista completa em: `GET /api-de-dados/orgaos-siafi`
