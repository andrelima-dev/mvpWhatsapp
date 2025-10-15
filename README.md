# WhatsApp Support MVP

MVP para um painel de atendimento multiusuário inspirado no WhatsApp Web, com backend em NestJS, frontend em Next.js e integração via API de WhatsApp (Evolution, MegaAPI ou equivalente).

## Visão Geral
- **Frontend:** Next.js 14 (App Router), React Query, Zustand, TailwindCSS.
- **Backend:** NestJS + Prisma + PostgreSQL, autenticação JWT, Socket.IO, BullMQ.
- **Infra:** Redis para filas, Docker Compose para desenvolvimento.

## Estrutura do Monorepo
```
apps/
  api/        # Backend NestJS
  web/        # Frontend Next.js
packages/
  types/      # Tipos compartilhados (DTOs e contratos)
```

## Pré-requisitos
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose (para banco e Redis)

## Primeiros Passos
```powershell
pnpm install
pnpm run dev
```
Isso iniciará API e Web em paralelo (`http://localhost:3000` para o frontend, `http://localhost:3333` para a API).

## Variáveis de Ambiente
Use os arquivos `.env.example` em `apps/api` e `apps/web` como base e crie seus `.env` locais.

## Scripts Úteis
```powershell
pnpm run lint
pnpm run test
pnpm run build
```

## Próximos Passos
- Conectar-se à API de WhatsApp escolhida (veja `apps/api/src/modules/whatsapp`).
- Completar casos de uso do painel administrativo e do chat.
- Adicionar observabilidade (logs estruturados, métricas) conforme necessário.
