# ANCOREO — Briefing completo de front-end

> Documento para redesenho de interface. Levantado direto do código em 14/08/2026
> (`app/`, `components/`, `lib/`), não de documentação. Toda página listada aqui
> existe de verdade no repositório.
>
> Stack: Next.js 14 (App Router) · TypeScript · Supabase (Postgres + RLS multi-tenant) ·
> Vercel · ícones Phosphor · fontes Google via `next/font`.

---

## 1. O que é a ANCOREO

A ANCOREO é uma plataforma onde o dono de um negócio pequeno responde **sete
perguntas** e sai com um site completo no ar — textos escritos por IA, já
otimizados para ser encontrado.

A diferença dela para um construtor de sites comum é o alvo: não é "ter um site
bonito", é **ser encontrado em três lugares ao mesmo tempo**.

| sigla | o que significa | pergunta que responde |
|---|---|---|
| **SEO** | busca clássica no Google | meu site aparece quando alguém pesquisa? |
| **GEO** | Generative Engine Optimization | o ChatGPT, o Gemini e o Perplexity me citam quando alguém pergunta? |
| **AEO** | Answer Engine Optimization | meu conteúdo é *a resposta*, não só um link? |

Esses três eixos são a espinha dorsal do produto. Aparecem na landing, viram
três anéis de score no painel, e determinam o que a IA escreve em cada página.

**O leitor-alvo é um dono de PME** — clínica, barbearia, mecânica, advogado,
restaurante. Ele não sabe o que é DNS, não sabe o que é schema markup, e já
gastou dinheiro com tráfego pago sem retorno. A interface inteira precisa
traduzir: em vez de "seu LCP está em 3,2s", dizer "seu site está lento e isso
derruba você no Google".

**Metáfora da marca:** náutica. O nome vem de âncora. O ícone da marca é
`ph-anchor`. A landing fala em "sete dias pra zarpar", "três rumos, um site".
Não é decoração — é o fio condutor do vocabulário.

**Planos:** Starter R$ 97/mês (1 site, 4 artigos), Pro R$ 197/mês (3 sites, 20
artigos, score completo), Agency R$ 297/mês (ilimitado, white-label). Todos
começam com 7 dias grátis no Pro, sem cartão.

---

## 2. Linguagem visual atual

Hoje existem **dois mundos visuais** distintos e propositais. Vale decidir
conscientemente se o redesenho mantém a separação ou unifica.

### 2.1 Mundo A — editorial impresso (landing, auth, legal)

Papel creme com tinta navy e um vermelho de carimbo. Cantos quase retos
(`--radius: 0.375rem`) porque a linguagem é de material impresso, não de app.

**Tokens reais** (`app/globals.css`, em HSL):

| token | claro | escuro | uso |
|---|---|---|---|
| `--background` | `42 33% 96%` — papel creme | `209 55% 10%` — navy noturno | fundo |
| `--foreground` | `209 70% 13%` — tinta navy `#0A2239` | `42 33% 96%` | texto |
| `--card` | `40 30% 99%` | `209 45% 14%` | superfície |
| `--primary` | navy | creme | ação primária |
| `--accent` | `352 68% 50%` — vermelho sinal `#D7263D` | `352 68% 54%` | destaque, CTA |
| `--muted-foreground` | `213 18% 40%` | `213 20% 68%` | texto secundário |
| `--border` | `40 16% 84%` | `209 30% 22%` | linhas |

**Tipografia** (todas via `next/font/google`, já instaladas):

- **Fraunces** — display serif, títulos H1/H2/H3. É a personalidade da marca.
- **Plus Jakarta Sans** — headings de UI e a wordmark ANCOREO (peso 800, `letter-spacing: .14em`).
- **Inter** — corpo de texto.
- **IBM Plex Mono** — eyebrows, labels e chips. Sempre `uppercase` com `letter-spacing: .07em–.12em`.

Esse quarteto é o que dá o ar "editorial" e não "SaaS genérico". Recomendo manter.

### 2.2 Mundo B — liquid glass (todo o painel logado)

O painel usa os **mesmos tokens**, mas remapeados para superfícies de vidro:
fundo com uma `aura` difusa animada, cartões translúcidos, sidebar fixa.
Ícones Phosphor em `duotone` no menu e `fill` nos destaques.

Arquivos: `app/(dashboard)/painel.css`, `app/(dashboard)/layout.tsx`.

### 2.3 Tema

Claro e escuro funcionam nos dois mundos, via `class` no root, com um
`ThemeToggle` no rodapé da sidebar. Qualquer tela nova precisa nascer com os
dois testados.

---

## 3. Mapa completo de páginas

**29 páginas, 5 layouts.** Organizadas por route group.

### 3.1 Público — sem login

#### `/` — Landing (`app/page.tsx`, 432 linhas)

A página mais trabalhada do produto hoje. Estrutura:

1. **Hero editorial.** Eyebrow "SEO · GEO · AEO — três rumos, um site". H1: *"Seu site pronto pra **aparecer** no Google e nas IAs"* — a palavra Google é renderizada com as cores reais da marca, letra por letra. Dois CTAs: "Começar grátis" (vermelho) e "Ver como funciona" (fantasma). Selo de garantia: "7 dias pra zarpar · sem cartão de crédito".
2. **Faixa de estatísticas.**
3. **`#como` — Do zero ao site publicado em três passos:** você conta do negócio → a IA escreve tudo → publica no seu domínio.
4. **`#pilares` — A busca mudou:** três cartões, um por eixo (ser encontrado no Google / ser referenciado pelas IAs / ser a resposta).
5. **Bloco de citação por IA:** "Quando alguém pergunta pra IA, o seu negócio aparece na resposta."
6. **`#modelos` — Um visual à altura do seu negócio:** vitrine de templates.
7. **Bloco dos três motores** + **bloco de crescimento composto** ("cada mês fica mais fácil de te encontrar").
8. **`#precos`** — três planos, o do meio com flâmula "Mais popular".
9. **FAQ** — "O que você precisa saber".
10. **CTA final** — "Seu próximo cliente está navegando agora".

Tem elementos gráficos próprios já construídos em CSS: um mock de site em
miniatura (`.msite`), pílulas de IA (`.ai-pill`), um carimbo postal
(`.postmark`), e um marquee horizontal.

#### Autenticação — `app/(auth)/`, layout próprio

| rota | o que é |
|---|---|
| `/login` | entrar (231 linhas) |
| `/signup` | criar conta (227 linhas) |
| `/confirme-email` | tela de espera pós-cadastro, com reenvio (164 linhas) |
| `/reset` | pedir link de recuperação |
| `/reset/update` | definir a nova senha |

#### Legal — `app/(legal)/`, layout próprio

`/termos` e `/privacidade`. Documentos longos, precisam de tipografia de leitura
e índice lateral.

---

### 3.2 Criação do site

#### `/onboarding` — o coração do produto (1.748 linhas, a maior página)

**Sete telas em sequência**, com barra de progresso. É por aqui que todo cliente
entra, e é a tela que mais precisa de atenção no redesenho — hoje ela é densa.

| # | pergunta na tela | o que coleta |
|---|---|---|
| 1 | **O que você quer construir?** | 4 cartões: Serviço/agendamento · Institucional · Portfólio · Loja. A escolha sugere modelo e paleta. |
| 2 | **Qual é o nome do seu negócio?** | nome, e busca automática de logo |
| 3 | **Conte rapidinho o que você faz** | texto livre + 9 categorias com nichos (Saúde, Serviços, Automotivo, Beleza, Alimentação, Educação, Profissional, Comércio, Eventos). Nichos regulados abrem campo condicional de registro: CRM, CRO, CRP, CREFITO, CRMV, CRN, OAB, CRC, CAU. |
| 4 | **Qual o tamanho e onde você atende?** | porte (MEI/autônomo · micro/pequena 2–49 · média 50–249 · grande 250+) + cidades. O porte define se a área é local, regional ou nacional. |
| 5 | **Você já tem Perfil de Empresa no Google?** | vincular perfil existente ou criar. |
| 6 | **Compartilhe o que só quem é da área sabe** | duas perguntas abertas de E-E-A-T: "o que seus clientes mais perguntam?" e "um truque da sua área que poucos sabem?". É aqui que nasce o diferencial de conteúdo. |
| 7 | **Você está pronto pra gerar o site** | revisão + disparo. |

Depois vem uma **animação de geração** ("Criando seu site…") com etapas narradas,
e um painel explicativo "Como o diagnóstico funciona".

> **Nota de negócio:** hoje 8 sites são gerados para cada 1 publicado. O
> vazamento é grande e provavelmente mora entre o fim do onboarding e a
> publicação. Um redesenho que reduza esse abandono vale mais que qualquer
> outra tela.

> **Pendente:** falta uma **quinta opção de porte, "Enterprise"**, que sai do
> fluxo automático e vira contato comercial em vez de site gerado.

#### `/templates` — escolher modelo

Vitrine com preview real usando os dados do cliente. Existem **10 layouts**
implementados: Academia, Acolhedor, Bold, Clean, Conversão, Jovem, Magazine,
Portfólio, Profissional, Tech.

#### `/preview/[siteId]` e `/preview/template`

Visualização do site antes de publicar.

---

### 3.3 Painel logado — shell com sidebar

`app/(dashboard)/layout.tsx`. Sidebar fixa com wordmark ANCOREO + âncora, nav,
botão "Novo site", toggle de tema e rodapé com avatar de iniciais, nome do
negócio, plano e sair.

**Faixa de alerta condicional:** se o Perfil do Google não estiver vinculado,
aparece uma barra no topo de todas as telas: *"Conecte seu Perfil de Empresa no
Google pro seu site aparecer."*

#### `/metrics` — "Painel" (tela inicial)

Subtítulo: *"como você está aparecendo"*. Três anéis de score (SEO, GEO, AEO)
com dados reais da API, bloco "o que melhorar", e contagem de visitas vinda da
telemetria própria. O ranking de palavras-chave ainda mostra "em breve" —
depende do Search Console.

#### `/sites` — "Meus sites"

Saudação personalizada, cartões de site com paleta, nicho e status
(rascunho/publicado/arquivado). Barra de progresso do onboarding quando
incompleto ("Onboarding em X% · Continuar"). Estado vazio: *"Seu primeiro site
está a 10 minutos"*.

#### `/editor` → `/editor/[siteId]` — editor de site

Layout próprio, tela cheia (410 linhas). Preview ao vivo com alternância
**desktop/mobile** — o desktop renderiza a 1280px e escala para caber no palco.
Edita paleta, par de fontes, e liga/desliga agendamento e captura de leads.

> **Este é o ponto fraco reconhecido do produto.** Nas palavras do dono:
> *"o editor dele tá horrível ainda"*. Se houver um lugar para investir
> pesado no redesenho, é aqui.

#### `/blog` e `/blog/[postId]`

Lista de artigos com cota por plano visível (Starter 4/mês, Pro 20/mês, Agency
ilimitado). CTA: *"Deixe a IA escrever por você"*. O `[postId]` é o editor do
post.

#### `/agendamentos`

*"solicitações de horário do seu site"* — o que o widget de agendamento do site
publicado capturou.

#### `/leads`

*"contatos capturados no seu site"* — mesma estrutura dos agendamentos.

#### `/gbp` — "Google Perfil de Empresa"

A IA escreve o rascunho do post; o cliente copia e cola no perfil dele e marca
como publicado. Tem calendário mensal de pauta e ponte com o blog (artigo
publicado vira post do Perfil).

> A publicação automática depende de aprovação da API do Google, ainda pendente.
> Até lá o fluxo é assistido de propósito, e a interface precisa deixar isso
> natural em vez de parecer uma limitação.

#### `/parcerias`

Troca de backlinks **entre clientes da plataforma**, em anéis de três
(A→B→C→A, direção única, sem recíproco). Opt-in, sugestões ranqueadas por
afinidade, convites recebidos e anéis ativos.

#### `/settings`

Conta, plano, uso contra a cota (sites e artigos), e é onde se conecta o Perfil
do Google.

#### `/aeo` — "Painel AEO" *(fora do menu, de propósito)*

Score de visibilidade em IA, citações da marca, visitas de bots de IA, evolução
em 90 dias, "onde você é citado", perguntas monitoradas.

> **Está fora do menu porque os números são amostra sintética, não medição
> real.** Tem selo de "amostra" na tela. Volta para o menu quando a medição
> real entrar. Vale desenhar, mas sabendo que hoje é demonstração.

---

### 3.4 Site do cliente final — multi-tenant por domínio

Estas páginas são **o produto entregue**: o site que o cliente publica. Quem vê
é o cliente *do* cliente.

| rota | o que é |
|---|---|
| `/[domain]` | home do site gerado — renderiza um dos 10 layouts |
| `/[domain]/blog` | lista de artigos |
| `/[domain]/blog/[slug]` | artigo |
| `/[domain]/loja` | catálogo *(fora do MVP até 01/09)* |
| `/[domain]/produto/[slug]` | produto *(fora do MVP)* |

Componentes: `SiteShell`, `LayoutRenderer`, `SiteTemplate`, `BlogList`,
`BlogArticle`, `ProductGrid`, `ProductDetail`.

---

## 4. Onde o redesenho rende mais

Em ordem de retorno, na minha leitura:

1. **`/editor/[siteId]`** — reconhecidamente ruim, e é onde o cliente passa mais tempo depois de gerar.
2. **`/onboarding`** — 1.748 linhas, sete telas densas, e um vazamento de 8 para 1 na conversão.
3. **`/metrics`** — é a tela que justifica a assinatura todo mês. Precisa fazer o dono de PME *entender* três siglas sem explicação.
4. **Os 10 layouts de site** — são o produto entregue. Se parecerem template genérico, a plataforma inteira parece.
5. **`/`** — já é boa, mas é a porta de entrada.

## 5. Restrições que o redesenho precisa respeitar

- **Português do Brasil com acentuação correta** em toda a interface.
- **Claro e escuro** obrigatórios em qualquer tela nova.
- **Vocabulário de dono de PME**, nunca de agência: "seu site está lento", não "LCP acima de 2,5s".
- **Ícones Phosphor** (`ph-duotone`, `ph-fill`) já estão instalados e em uso.
- **Nada de dado inventado na tela.** Se um número é amostra, ele carrega selo de amostra. Essa é regra do projeto, não preferência estética.
- Loja e cobrança estão **fora do MVP** até 01/09 — as páginas existem, mas não são prioridade de design agora.
