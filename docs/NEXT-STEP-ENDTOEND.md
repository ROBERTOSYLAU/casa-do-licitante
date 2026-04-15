# Próximo passo: validação end-to-end do worker

## Objetivo
Validar a ingestão real de ComprasNet até persistência canônica no banco.

## Pré-requisitos
- Docker ativo
- `POSTGRES_PASSWORD` configurado
- `COMPRASNET_API_KEY` configurado em ambiente seguro

## Caminho recomendado
1. Subir infraestrutura:
   - `docker compose up -d postgres redis`
2. Aplicar migrations / client se necessário.
3. Rodar worker com ambiente completo.
4. Disparar job de ingestão ComprasNet.
5. Verificar:
   - `SyncLog`
   - `RawComprasnetRecord`
   - `Licitacao` com `source = comprasnet`

## Evidência já validada
- A API oficial respondeu com sucesso em teste real autenticado.
- A integração retornou 33 registros válidos em consulta real.

## Bloqueio encontrado nesta sessão
- Docker indisponível no host durante esta tentativa.
- `DATABASE_URL` e `REDIS_URL` não estavam ativos no shell da sessão.

## Próximo passo exato ao retomar
Executar a validação end-to-end assim que Docker e ambiente estiverem disponíveis.
