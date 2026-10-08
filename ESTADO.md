# ESTADO — ANCOREO

> **ARQUIVO GERADO. Não edite à mão.** Rode `node scripts/estado.mjs`.
> Cada linha abaixo foi verificada contra o código e o banco, não contra outro documento.
> Última geração: **2026-09-23**

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

## Banco (produção, contagem real)

| tabela | linhas |
|---|---:|
| tenants | 14 |
| onboarding_profiles | 13 |
| sites | 9 |
| blog_posts | 0 |
| score_snapshots | 3 |
| gbp_posts | 0 |
| leads | 0 |
| products | 0 |
| orders | 0 |
| sites (publicados) | 2 |

Zero linhas não significa quebrado: significa que ninguém exercitou aquele caminho ainda. Cruze com as sondas acima antes de concluir.

## Git

Branch: `master`

- `c1fa034` painel: fila Enterprise + regenera ESTADO/PAINEL _(6 weeks ago)_
- `b52c9c8` docs: PAINEL, a planilha de acompanhamento, com a coluna que separa fato de plano _(6 weeks ago)_
- `24dab6a` docs: ESTADO e DIARIO regerados apos o commit do diario _(6 weeks ago)_
- `5ed97b8` docs: DIARIO.md gerado do git, pra responder "o que mudou desde que eu olhei" _(6 weeks ago)_
- `4e930c0` editor: preview de Desktop deixa de renderizar em largura de celular _(6 weeks ago)_

**Trabalho não commitado:** 

```
M .claude/agents/ancoreo-qa.md
 M .claude/launch.json
 M .claude/skills/ancoreo-status/SKILL.md
 M .claude/skills/cronograma/SKILL.md
 M AGENTS.md
 M CLAUDE.md
 M ESTADO.md
 M PAINEL.csv
 M PAINEL.md
 M RITUAL.md
 M app/(dashboard)/PainelNav.tsx
 M app/(dashboard)/painel.css
 M app/(editor)/editor.css
 M app/(editor)/editor/[siteId]/components/EditorSidebar.tsx
 M app/(editor)/editor/[siteId]/components/panels/CustomizationPanel.tsx
 M app/(editor)/editor/[siteId]/components/panels/SectionEditor.tsx
 M app/(editor)/editor/[siteId]/components/useEditBridge.ts
 M app/(editor)/editor/[siteId]/page.tsx
 M app/[domain]/page.tsx
 M app/api/generate/site/route.ts
 M app/llms.txt/route.ts
 M app/onboarding/page.tsx
 M app/sitemap.ts
 M components/templates/SiteTemplate.tsx
 M components/templates/layouts/AcademiaLayout.tsx
 M components/templates/layouts/AcolhedorLayout.tsx
 M components/templates/layouts/BoldLayout.tsx
 M components/templates/layouts/CleanLayout.tsx
 M components/templates/layouts/ConversaoLayout.tsx
 M components/templates/layouts/JovemLayout.tsx
RM design/harpia-editor-ux-proposal.html -> design/ancoreo-editor-ux-proposal.html
 M docs/BRIEFING-FRONTEND.md
 M docs/DEV-LOGIN.md
 M lib/blog/posts.ts
 M lib/ecommerce/products.ts
 M lib/templates/build-site-content.ts
 M scripts/planilha.mjs
?? ANCOREO-COLABORACAO.md
?? app/(dashboard)/PainelSkeleton.tsx
?? app/(dashboard)/aeo/loading.tsx
?? app/(dashboard)/agendamentos/loading.tsx
?? app/(dashboard)/blog/[postId]/loading.tsx
?? app/(dashboard)/blog/loading.tsx
?? app/(dashboard)/editor/loading.tsx
?? app/(dashboard)/gbp/loading.tsx
?? app/(dashboard)/leads/loading.tsx
?? app/(dashboard)/metrics/loading.tsx
?? app/(dashboard)/parcerias/loading.tsx
?? app/(dashboard)/settings/loading.tsx
?? app/(dashboard)/sites/loading.tsx
?? app/(editor)/editor/[siteId]/components/useHomeSections.ts
?? app/(editor)/editor/[siteId]/loading.tsx
?? docs/REVISAO-CODEX-2026-09-12-ALTERACOES.md
?? docs/REVISAO-CODEX-2026-09-12.md
?? docs/SEGURANCA-DOMINIO.md
?? lib/editor/generation-stream.ts
?? lib/sites/published.ts
?? lib/sites/save-generated-sections.ts
?? scripts/check-generation-save.cjs
?? scripts/check-generation-stream.cjs
?? scripts/check-public-scope.cjs
```

**Commits locais não enviados:** nenhum

---

O que mudou e quando: [DIARIO.md](DIARIO.md) · Próximos passos e definição de pronto: [MVP.md](MVP.md) · Como trabalhamos: [RITUAL.md](RITUAL.md)
