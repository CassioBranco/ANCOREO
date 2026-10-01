# ESTADO — ANCOREO

> **ARQUIVO GERADO. Não edite à mão.** Rode `node scripts/estado.mjs`.
> Cada linha abaixo foi verificada contra o código e o banco, não contra outro documento.
> Última geração: **2026-10-01**

## Sondas por pilar do MVP

Uma sonda é uma afirmação que o script testa por grep no código. `ligado` só
aparece se o grep encontrar o chamador — módulo escrito e sem ninguém chamando
conta como **não ligado**.

### Onboarding

- **ligado** — Fluxo de onboarding existe e grava perfil

### Site builder

- **ligado** — Geração de site por IA está ligada ao onboarding
- **ligado** — Publicação de site tem rota e chamador

### Blog builder

- **ligado** — Editor de post chama a rota de publicação de blog

### Métricas

- **ligado** — Painel lê score real da API (não hardcoded)
- **ligado** — Score é persistido em histórico (score_snapshots)
- `NÃO LIGADO` — AEO usa medição real (hoje: amostra sintética)
- **ligado** — Visitas de robô de IA são contadas no site do cliente

### GBP

- `NÃO LIGADO` — Existe integração com a API do Google (OAuth + publicação)
- **ligado** — Rascunho de post do Google é gerado por IA
- **ligado** — Cliente registra que publicou no perfil (published_at é escrito)
- **ligado** — Calendário do mês: posts saem com data marcada
- **ligado** — Link do Perfil é lido, guardado com place_id e vinculável no painel
- **ligado** — Lembrete semanal do post sai sozinho (rota + agendamento)
- **ligado** — Ponte blog ↔ Perfil: artigo publicado vira post, post vira pauta

### Fora do MVP

- `NÃO LIGADO` — Loja: botão de compra ligado ao checkout
- `NÃO LIGADO` — Loja: painel de produtos existe

## Banco

Não consultado (faltou `NEXT_PUBLIC_SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` no ambiente).

## Git

Branch: `claude/cloud-session-check-6yxoj7`

-  painel: fila Enterprise + regenera ESTADO/PAINEL _(7 weeks ago)_
-  docs: PAINEL, a planilha de acompanhamento, com a coluna que separa fato de plano _(7 weeks ago)_
-  docs: ESTADO e DIARIO regerados apos o commit do diario _(7 weeks ago)_
-  docs: DIARIO.md gerado do git, pra responder "o que mudou desde que eu olhei" _(7 weeks ago)_
-  editor: preview de Desktop deixa de renderizar em largura de celular _(7 weeks ago)_

**Trabalho não commitado:** 

```
M app/(dashboard)/metrics/MetricsView.tsx
 M app/(dashboard)/metrics/page.tsx
 M app/robots.ts
 M lib/analytics/events.ts
 M lib/analytics/queries.ts
 M middleware.ts
 M scripts/estado.mjs
?? lib/analytics/bot-visit.ts
?? lib/seo/ai-bots.ts
?? scripts/check-ai-bots.ts
```

**Commits locais não enviados:** nenhum

---

O que mudou e quando: [DIARIO.md](DIARIO.md) · Próximos passos e definição de pronto: [MVP.md](MVP.md) · Como trabalhamos: [RITUAL.md](RITUAL.md)
