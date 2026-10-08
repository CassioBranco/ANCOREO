<!-- Conferido contra o código e o banco em 21/08/2026. Ver bloco de verificação abaixo. -->

> ## Verificação (Claude, 21/08/2026) — leia antes do documento
>
> Este arquivo veio de fora do repositório. Conferi cada afirmação factual contra
> o código em `D:\ancoreo` e contra o banco Supabase `yejjeiveqgkgrtcettkl`.
>
> **Correções ao texto original:**
> - São **32** tabelas em `public`, não 31. RLS está habilitado nas 32.
> - RLS habilitado **não** significa RLS auditado: `analytics_events`, `audit_logs`,
>   `plan_quotas`, `prompt_templates` e `score_rules` têm RLS ligado e **zero policies**
>   (deny-all para `anon`/`authenticated`; só `service_role` alcança). Confirmado pelo
>   linter do Supabase (`rls_enabled_no_policy`, 5 ocorrências).
> - Os três estudos citados em "Notas de origem" (`estudos/*.md`) **não existem** neste
>   repositório nem em Downloads/Desktop/D:. O documento não é verificável na origem.
>
> **Já é verdade no código:**
> - As 4 tabelas do anel existem e estão aplicadas (`20260703140000_partner_backlinks.sql`),
>   cada uma com RLS e policy por tenant. O anel tem chamadores reais:
>   `app/(dashboard)/parcerias/page.tsx`, `app/api/partners/{optin,request,respond,suggestions}`,
>   `lib/seo/partner-match.ts`, `lib/seo/partner-inject.ts`.
> - Direção única já é a regra (anel A→B→C→A, sem recíproco) — trava 1 de 5 existe.
> - Opt-in real já existe (`partner_optin` com chamador em `/api/partners/optin`) — trava 5 de 5 existe.
> - Há cabeçalhos de segurança em `next.config.mjs`: `X-Frame-Options`, `X-Content-Type-Options`,
>   `Referrer-Policy`, `Permissions-Policy`.
>
> **Ainda não existe (e portanto é escopo novo):**
> - `sites.domain_expires_at` — a coluna não existe. Colunas atuais de `sites`: id, tenant_id,
>   domain, preset, palette_index, status, created_at, niche, template, font_pair, palette,
>   palette_name, booking_enabled, leads_enabled.
> - Kill switch do anel: `partner_ring_links.status` so aceita `planned|rendered|removed`.
>   Não há estado de "suspenso/comprometido".
> - Relevância temática via `niche_taxonomy`: o matching de hoje é por afinidade Jaccard de
>   keywords (`lib/seo/partner-match.ts` usando `extractKeywords`/`similarity`), não pela
>   taxonomia de nicho. A tabela `niche_taxonomy` existe, mas o anel não a consulta.
> - Teto de volume e cadência do anel: não há limite no código.
> - Âncora variada: `anchor_text` recebe sempre `best.to.title` (título do post alvo). Não há
>   rotação/variação deliberada.
> - CSP: não há `Content-Security-Policy` em `next.config.mjs`.
> - Content integrity check: não existe.
>
> **Achados extras do linter que o documento não menciona:**
> - `auth_tenant_id()` e `rls_auto_enable()` são SECURITY DEFINER executáveis por `anon`.
> - 3 funções com `search_path` mutavel (`set_blog_posts_updated_at`, `enforce_site_limit`, `match_knowledge`).
> - Proteção de senha vazada (HaveIBeenPwned) desligada no Supabase Auth.
> - `next.config.mjs` tem `typescript.ignoreBuildErrors: true` — o build não barra erro de tipo.
>
> **Higiene do item 4:** ainda há 16 arquivos com referência a `harp-ia`/`HARP.IA`, a maioria
> em `docs/_arquivo/`. O repo GitHub continua `CassioBranco/HARP.IA`.

---

# Ancoreo — Segurança de Domínio e Anti-Abuso de Autoridade

**Para:** Cássio (dev) e Dove
**Data:** 21 de agosto de 2026
**Contexto:** o Ancoreo (ex-HARP.IA, projeto Supabase `yejjeiveqgkgrtcettkl`, Postgres 17, `sa-east-1`) constrói sites com SEO, GEO e AEO nativos. Ele fabrica autoridade de domínio para os clientes. Este documento define como o produto **protege** essa autoridade, tanto a de cada tenant quanto a reputação da própria plataforma.
**Estudo de base:** `estudos/seguranca-dominio-farming-2026.md`. Leia antes.

---

## 1. Por que isto é requisito de produto, não item de backlog

O Ancoreo tem um risco que a maioria dos SaaS não tem: **ele acumula autoridade de SEO em muitos domínios ao mesmo tempo e ainda liga esses domínios entre si** (o anel de parceiros da NV4, tabelas `partner_optin`, `partner_rings`, `partner_requests`, `partner_ring_links`).

Isso cria três exposições que precisam de resposta de engenharia:

1. **Cada site de tenant é um alvo.** Quanto melhor o Ancoreo posiciona um cliente, mais valioso o domínio dele fica para quem faz farming e SEO poisoning.
2. **A plataforma é um alvo concentrado.** Comprometer o Ancoreo é comprometer a autoridade de todos os tenants de uma vez. É um "Hacklink" pronto, com dezenas de domínios confiáveis.
3. **O anel de backlinks pode ser sequestrado como arma.** A funcionalidade que hoje distribui link equity entre blogs parceiros é, tecnicamente, a mesma mecânica que um atacante usaria para injetar links maliciosos em rede. Se um tenant do anel for comprometido, ele contamina os parceiros. O recurso precisa nascer com trava.

> Regra de produto: o Ancoreo constrói autoridade real. Qualquer feature que possa ser confundida com manipulação (rede de links, conteúdo gerado em escala, domínio reaproveitado) precisa de salvaguarda explícita, senão o próprio Google pune a plataforma inteira sob as políticas de abuso de reputação e de domínio expirado.

---

## 2. As três superfícies de risco e o que fazer em cada uma

### 2.1 Superfície: o domínio do tenant (contra farming e expiração)

**Risco:** o cliente sai da plataforma, ou esquece de renovar, e o domínio com a autoridade que o Ancoreo construiu é capturado e reaproveitado para golpe.

**Requisitos de produto:**
- **Monitor de expiração de domínio.** Consultar a data de expiração (WHOIS/RDAP) de cada domínio conectado e alertar tenant e operação em 60, 30 e 7 dias. Campo novo no schema: `sites.domain_expires_at`, atualizado por job.
- **Checagem de saúde no onboarding.** Ao conectar o domínio, registrar quem é o titular, se há renovação automática, se há transfer lock. Expor um "score de segurança de domínio" no painel do tenant (espelha o scorecard do onboarding manual da agência).
- **Aviso de offboarding.** Quando um tenant cancela, o painel e o e-mail de saída explicam, em texto claro, o risco de largar o domínio no vácuo, e oferecem manter ou redirecionar. Reduz o abandono que o farming captura, e é bom para a reputação da plataforma.

### 2.2 Superfície: o site publicado (contra invasão e injeção)

**Risco:** injeção de link/página/redirect no site que o Ancoreo publica, pendurando conteúdo malicioso na autoridade do tenant.

**Requisitos de produto:**
- **Publicação imutável / server-side controlado.** Quanto mais o Ancoreo renderiza a partir da própria base (`pages`, `sections`, `blog_posts`) e menos depende de execução aberta no site final, menor a superfície de injeção. Renderização controlada pela plataforma é uma vantagem de segurança sobre WordPress, e deve ser tratada como argumento de venda.
- **Content integrity check.** Job que compara o HTML publicado com o que está na base. Divergência (link, script ou página que não saiu do Ancoreo) dispara alerta. Isso pega injeção que o Search Console levaria dias para mostrar.
- **Sanitização de todo conteúdo gerado ou colado.** Nada de `<script>`, iframe ou link externo não aprovado entrando por campo de conteúdo. Vale para conteúdo de IA (`ia_generations`) e para qualquer entrada de usuário.
- **Cabeçalhos de segurança por padrão** nos sites publicados: CSP restritiva, `X-Frame-Options`, HTTPS forçado.
- **robots e crawlability para IAs sob controle da plataforma** (Ciclo Source & Crawl), sem abrir brecha de cloaking.

### 2.3 Superfície: o anel de parceiros (contra virar rede de spam)

**Risco duplo:** (a) o anel ser lido pelo Google como PBN (rede privada de blogs) e punido; (b) um tenant comprometido usar o anel para propagar links maliciosos aos parceiros.

**Requisitos de produto — as travas do anel:**
- **Direção única, nunca recíproca** (já é a regra: anel de 3 tenants, uma direção). Manter e documentar o porquê: reciprocidade em escala é padrão de PBN.
- **Relevância temática obrigatória.** Só linkar tenants do mesmo nicho ou de nicho adjacente. Link entre uma clínica e uma loja de peças é sinal de rede artificial. Usar a `niche_taxonomy` para validar.
- **Limite de volume e cadência.** Teto de links por tenant e ritmo natural de crescimento. Anel que aparece com 300 links no mesmo dia é bandeira vermelha para o Google.
- **Âncora natural, nunca exata em massa.** O texto-âncora dos links do anel precisa variar. Âncora de correspondência exata repetida é o sinal clássico de link building manipulado (e é justamente o que o SEO 5.0 abandona, ver `estudos/conversion-seo-5-0-ciclos.md`).
- **Kill switch do anel.** Se um tenant do anel for detectado como comprometido (ver 2.2), seus links de saída no anel são suspensos automaticamente, para não contaminar os parceiros. Campo de estado em `partner_ring_links`.
- **Opt-in real e auditável** (`partner_optin`). O tenant sabe e concorda em participar. Nada automático e silencioso.

---

## 3. Segurança da plataforma (o alvo concentrado)

O Ancoreo já parte bem: **RLS habilitado em todas as 31 tabelas** e comentários de LGPD em `analytics_events` (pseudônimo, 1st-party, sem PII/IP, base legal de legítimo interesse com opt-out). Sobre essa base:

- **RLS auditado, não só habilitado.** Revisar as políticas para garantir que nenhum tenant enxergue ou escreva dado de outro. Isolamento multi-tenant é a primeira linha: um vazamento entre tenants aqui é o cenário de "comprometer todos de uma vez".
- **2FA obrigatório** para contas de operação e recomendado para tenants. Chave física ou app, não SMS.
- **Menor privilégio** nas chaves e tokens. Auditar `service_role` e chaves de API; rotacionar periodicamente; nada de chave de serviço no front-end.
- **Segregação de ambientes.** Separar produto (`public`) da operação da agência (schema `ops` sugerido no `estudos/ancoreo-saas-status.md`). Dado de cliente da agência não mistura com tenant de SaaS.
- **Higiene de dependências.** A maior onda de ataques de 2026 foi cadeia de suprimento em plugins e pacotes (ShapedPlugin, 31 plugins via Flippa). Fixar versões, revisar dependências novas, desconfiar de pacote que trocou de dono.
- **`audit_logs` de verdade.** A tabela existe; garantir que ações sensíveis (mudança de domínio, publicação, entrada no anel, mudança de permissão) sejam registradas e revisáveis.
- **Backup testado com restauração ensaiada.** Backup nunca restaurado é esperança, não plano.
- **Monitor de reputação da plataforma.** Se qualquer tenant for sinalizado pelo Google (Safe Browsing, Search Console), a operação precisa saber na hora, porque a reputação de um respinga na infraestrutura compartilhada.

---

## 4. Higiene de limpeza do banco (herdado do status)

Pendências de `estudos/ancoreo-saas-status.md` que também são higiene de segurança:
- Renomear o projeto Supabase de "HARP.IA" para Ancoreo e limpar referências antigas.
- Aposentar o domínio de teste `harp-ia.com` e os e-mails `@harpia.test` — domínio de teste esquecido é, ele mesmo, candidato a farming.
- Confirmar que nenhum dado real de cliente da carteira vive em ambiente de teste.

---

## 5. Roadmap sugerido de segurança (fases)

| Fase | Entrega | Esforço | Prioridade |
|---|---|---|---|
| **S1** | Auditoria de RLS entre tenants; 2FA na operação; rotação de chaves de serviço | Baixo | Crítica |
| **S1** | Monitor de expiração de domínio (`domain_expires_at` + job de alerta) | Médio | Alta |
| **S2** | As cinco travas do anel de parceiros (relevância, direção única, volume, âncora, kill switch) | Médio | Alta |
| **S2** | Sanitização de conteúdo gerado/colado + CSP nos sites publicados | Médio | Alta |
| **S3** | Content integrity check (HTML publicado × base) com alerta | Alto | Média |
| **S3** | Score de segurança de domínio no painel + fluxo de offboarding | Médio | Média |
| **S4** | Monitor de reputação da plataforma (Safe Browsing / Search Console por tenant) | Médio | Média |

---

## 6. O que isto vira para o mercado

Segurança bem feita aqui não é só defesa, é diferencial de produto:

- **"O Ancoreo protege a autoridade que constrói."** Renderização controlada pela plataforma, sem a superfície de injeção do WordPress solto, é argumento real de venda.
- **Anel de parceiros com salvaguarda** é o oposto de PBN. Vender como "backlink de rede curada, relevante e auditada", não como esquema.
- **Monitor de expiração** é uma dor concreta de todo dono de site. Poucos concorrentes oferecem.

---

## Notas de origem
- Estudo-base `estudos/seguranca-dominio-farming-2026.md` (Infoblox, Netcraft, Google Search Central, guias de segurança de domínio e WordPress 2026).
- Estado técnico e schema do Ancoreo: `estudos/ancoreo-saas-status.md` (31 tabelas, RLS, anel NV4, notas de LGPD).
- Vocabulário e princípios de SEO 5.0: `estudos/conversion-seo-5-0-ciclos.md` (âncora natural, reputação semântica, o abandono do link building de âncora exata).
