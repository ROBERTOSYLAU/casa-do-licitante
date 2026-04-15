# PENDENCIAS.md

## Pendências técnicas e operacionais reais do projeto

### 1. Deploy e ambiente online
- corrigir o ambiente público que apresentou `502 Bad Gateway`
- validar publicação correta do app em `app.casadolicitante.com.br`
- validar publicação do serviço legado/API quando aplicável
- fechar deploy real na VPS

### 2. Login
- confirmar o fluxo de autenticação em produção
- localizar ou criar usuário válido para teste de login
- validar login funcional ponta a ponta no ambiente publicado

### 3. Worker e ingestão
- validar o worker ponta a ponta com Postgres + Redis ativos
- disparar ingestão real de ComprasNet no fluxo operacional
- verificar persistência canônica no banco
- verificar registros esperados em tabelas/logs operacionais

### 4. Infraestrutura
- garantir `DATABASE_URL` e `REDIS_URL` no ambiente correto
- garantir `COMPRASNET_API_KEY` no ambiente correto
- confirmar estratégia real de produção entre Docker e PM2 para evitar drift operacional
- validar Nginx, portas e proxy reverso

### 5. Produto / frontend
- continuar auditoria anti-fantasma em dashboard, contratos, fornecedores e módulos correlatos
- decidir o que vira fluxo real e o que deve ser escondido temporariamente
- amadurecer dashboard com dados reais

### 6. Versionamento
- revisar tudo que está em `git status`
- separar o que é alteração desta rodada do que já era alteração pré-existente
- commitar
- enviar ao GitHub

## Itens que já avançaram, mas ainda não estão fechados operacionalmente
- busca e detalhe já foram movidos para base canônica
- integração de ComprasNet já foi preparada e testada contra API real
- healthcheck já foi ampliado
- documentação técnica e operacional já foi criada
- melhorias anti-fantasma já começaram no frontend

## Bloqueios conhecidos registrados até aqui
- Docker indisponível em uma das tentativas locais anteriores
- `DATABASE_URL` e `REDIS_URL` não estavam ativos em um shell de validação anterior
- acesso SSH remoto da VPS não ficou concluído durante as tentativas registradas
- produção apresentou `502`, impedindo validação normal do login público
