# ESTADO — ANCOREO

> **ARQUIVO GERADO. Não edite à mão.** Rode `node scripts/estado.mjs`.
> Cada linha abaixo foi verificada contra o código e o banco, não contra outro documento.
> Última geração: **2026-10-08**

## Sondas por pilar do MVP

Uma sonda é uma afirmação que o script testa por grep no código. `ligado` só
aparece se o grep encontrar o chamador — módulo escrito e sem ninguém chamando
conta como **não ligado**.

### Onboarding

- **ligado** — Fluxo de onboarding existe e grava perfil

### Site builder

- **ligado** — Geração de site por IA está ligada ao onboarding
- **ligado** — Publicação de site tem rota e chamador
- **ligado** — Resposta direta abaixo do título (o trecho que a IA copia ao citar)

### Blog builder

- **ligado** — Editor de post chama a rota de publicação de blog

### Métricas

- **ligado** — Painel lê score real da API (não hardcoded)
- **ligado** — Score é persistido em histórico (score_snapshots)
- **ligado** — AEO usa medição real, sem amostra sintética na interface
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

- `3237554` merge: junta a navegação SPA com os 8 commits que estavam só no remoto _(11 seconds ago)_
- `4d3bfe9` spa: navegacao de aplicativo no painel e no editor _(13 minutes ago)_
- `699a96b` aeo: resposta direta abaixo do titulo, o trecho que a IA copia ao citar _(6 days ago)_
- `f66646c` telemetria: uma visita deixa de virar varias sessoes no funil _(7 days ago)_
- `940052f` editor: "Preencher tudo com IA" deixa de apagar o trabalho do dono _(7 days ago)_

**Trabalho não commitado:** nenhum

**Commits locais não enviados:** 

```
3237554 merge: junta a navegação SPA com os 8 commits que estavam só no remoto
4d3bfe9 spa: navegacao de aplicativo no painel e no editor
```

---

O que mudou e quando: [DIARIO.md](DIARIO.md) · Próximos passos e definição de pronto: [MVP.md](MVP.md) · Como trabalhamos: [RITUAL.md](RITUAL.md)
