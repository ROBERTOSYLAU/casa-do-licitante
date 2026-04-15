# LOCAL_GIT_VPS_SYNC.md

## Objetivo
Organizar o projeto `app-casa-do-licitante` para ficar coerente e reproduzível em três lugares:
- máquina local
- GitHub/remoto Git atual
- VPS

## Estado real atual

### 1. Local
Pasta raiz local:
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante`

Estado local observado:
- repositório git inicializado
- branch atual: `main`
- último commit local conhecido: `c4df51f fix(api): passa DB_PASSWORD via env para casa-api em vez de usar fallback hardcoded`
- há muitos arquivos modificados e novos ainda não commitados
- existem docs operacionais criadas localmente para organização e retomada

### 2. Git remoto configurado hoje
Remoto atual configurado:
- `origin -> ssh://root@191.101.71.42/root/app-casa-do-licitante`

Conclusão importante:
- esse remoto atual aponta para a VPS via SSH
- isso não é um GitHub tradicional
- então, hoje, o repositório remoto conhecido está ligado ao servidor, não a um repositório GitHub confirmado nesta sessão

### 3. VPS
Estado conhecido da VPS nesta conversa:
- deploy não foi concluído
- ambiente público apresentou `502 Bad Gateway`
- login público não foi validado
- acesso SSH remoto não ficou funcional até o momento, então não houve comparação completa do conteúdo real da VPS com o local

## O que já está alinhado localmente
- documentação de status criada
- documentação de execução local criada
- documentação de deploy VPS criada
- documentação da estrutura criada
- lista de pendências criada
- docs técnicas adicionais criadas em `docs/`
- parte importante do core da aplicação já atualizada localmente

## O que ainda não está alinhado entre os 3 lugares
### Local -> remoto git atual
Ainda não foi enviado:
- alterações rastreadas já modificadas
- arquivos novos criados nesta rodada
- documentação nova
- Dockerfiles novos
- migration nova
- ajustes do worker e da camada canônica

### Local -> VPS
Ainda não foi implantado/comparado de forma concluída:
- correções do core canônico
- worker ComprasNet
- healthcheck ampliado
- melhorias anti-fantasma
- novos Dockerfiles
- nova documentação
- migration `20260413142000_bigint_money_fields`

### GitHub
Situação real nesta sessão:
- não foi confirmado um remoto GitHub separado
- portanto, GitHub ainda não está fechado como fonte organizada e sincronizada

## Diferença prática entre os 3 pontos hoje
### Máquina local
É onde está o estado mais avançado e mais organizado do projeto.

### Remoto git atual
Existe, mas aponta para a VPS (`ssh://root@191.101.71.42/root/app-casa-do-licitante`).
Então ele não deve ser tratado automaticamente como GitHub.

### VPS
Ainda é o ponto mais incerto, porque o acesso remoto não foi estabilizado e o app público estava com erro `502`.

## Plano operacional recomendado para organizar os 3 lugares

### Etapa 1. Consolidar o local como fonte de verdade temporária
- revisar `git status`
- separar alterações novas das alterações pré-existentes
- revisar docs geradas
- validar build/type-check se necessário

### Etapa 2. Definir o remoto correto
Opções reais:
1. manter VPS como remoto operacional separado
2. configurar um remoto GitHub oficial como fonte principal
3. usar os dois, com convenção clara

Recomendação:
- `origin` deveria apontar para GitHub
- VPS deveria entrar como remoto separado, por exemplo `vps`

### Etapa 3. Fechar versionamento
- organizar commits por assunto
- enviar para o remoto correto
- garantir que `.env.local` não seja enviado

### Etapa 4. Fechar VPS
Quando o acesso SSH estiver estável:
- comparar árvore do projeto na VPS
- comparar `.env`/infra/serviços
- atualizar código
- aplicar migration
- rebuildar stack
- validar `api/health`
- validar login
- validar worker

## Evidências objetivas usadas neste documento
- branch atual: `main`
- remoto atual: `origin -> ssh://root@191.101.71.42/root/app-casa-do-licitante`
- último commit conhecido: `c4df51f fix(api): passa DB_PASSWORD via env para casa-api em vez de usar fallback hardcoded`
- status local contém arquivos modificados e novos ainda não commitados
- docs de apoio já criadas: `STATUS_ATUAL.md`, `COMO_RODAR_LOCAL.md`, `COMO_SUBIR_VPS.md`, `ESTRUTURA_DO_PROJETO.md`, `PENDENCIAS.md`

## Próximo passo exato
O próximo passo mais correto é:
1. confirmar se existe um repositório GitHub oficial separado
2. reorganizar os remotos Git
3. depois estabilizar o acesso SSH da VPS para comparação e deploy real
