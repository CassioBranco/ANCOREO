# DoveWiki: SEO, GEO e busca semântica (camada avançada)

> Gerado em 2026-10-07. Complementa o `dove-wiki/SKILL.md` (que cobre o Método CPF, clientes e operação). Aqui fica só o **vocabulário e as técnicas** que a Wiki ainda não tinha.
>
> **Como ler os selos de confiança**
> - `[FONTE]` = encontrado em página pública, link na seção Fontes.
> - `[VENDOR]` = blog ou estudo de empresa que vende o serviço. Indicativo, não prova.
> - `[A CONFIRMAR]` = precisa ser lido na fonte primária antes de virar promessa em palestra ou proposta.
>
> **Limites desta coleta (leia antes de usar)**
> 1. O LinkedIn exige login e não há credencial neste ambiente. Os perfis **não** foram lidos. Os nomes vieram de listas públicas de "top experts" (muitas escritas por agências que se autorrankeiam) e do trabalho publicado de cada pessoa.
> 2. O ambiente bloqueou `developers.google.com` e `ipullrank.com` (403 do proxy). A documentação do Google e o AI Search Manual foram conhecidos só por resumos de busca. Nada aqui foi lido na fonte primária do Google.
> 3. Os cursos do Google (Skillshop, Digital Garage) não foram abertos. Ver seção 7.

---

## 1. Quem estudar (mercado internacional)

| Nome | Foco | O que traz de novo |
|---|---|---|
| **Mike King** (iPullRank) | Relevance Engineering, query fan-out, AI Search Manual | SEO como engenharia de recuperação de informação: o alvo é o **trecho (passagem)**, não a página |
| **Aleyda Solis** (Orainti) | SEO internacional, multilíngue, GEO | Processos e checklists para escala e mercados múltiplos |
| **Jason Barnard** (Kalicube) | Entidade de marca, Brand SERP, Knowledge Panel | Framework Understandability, Credibility, Deliverability |
| **Andrea Volpini** (WordLift) | Knowledge graph, schema.org, SEO agêntico | Dados estruturados como linguagem comum entre site e agentes de IA |
| **Koray Tuğberk Gübür** (Holistic SEO) | Topical authority, topical maps | Mapa de tópicos com seção central e seção externa, source context |
| **Lily Ray** | Qualidade, E-E-A-T, estudos de citação em AI Overviews | Estudos de campo sobre quem a IA cita versus quem ela recomenda |
| **Kevin Indig** (Growth Memo) | Estudos de citação do ChatGPT | Dados de 1,2 milhão de respostas e 98 mil linhas de citação |
| **Cyrus Shepard**, **Wil Reynolds**, **Gianluca Fiorelli** | Pesquisa GEO, prática, SEO semântico | Citados em listas de 2026 `[VENDOR]` |

---

## 2. Vocabulário que a Wiki ainda não tinha

**Query fan-out.** A IA pega a pergunta do usuário e dispara de 8 a 12 sub-buscas relacionadas (subtópicos, comparações, dúvidas) em paralelo, depois monta a resposta com trechos de várias páginas. O Google diz que AI Overviews e AI Mode "podem usar" a técnica `[FONTE: Google, via resumo]`. A disputa passa a ser **por subconsulta**, não só pela palavra-chave principal.
> Para o cliente: um artigo precisa responder as perguntas vizinhas (preço, comparação, "quanto tempo", "qual o risco"), cada uma em seu próprio bloco.

**Passage ranking / chunking.** O sistema quebra a página em pedaços e pontua cada pedaço. Um parágrafo bom de um site pequeno pode ganhar de um guia de 5.000 palavras. `[VENDOR]` com mecanismo descrito por Mike King `[A CONFIRMAR]`.

**Embedding e similaridade semântica.** Texto vira uma lista de números (vetor). Consulta e trecho são comparados por proximidade (similaridade de cosseno), então "dentista em Sorocaba" casa com "clínica odontológica na região" sem repetir a palavra. Consequência prática: **um trecho focado em uma ideia pontua melhor que um trecho que mistura três**.

**Reciprocal rank fusion (RRF).** Um trecho que aparece bem em várias sub-buscas é impulsionado. `[VENDOR]`, não confirmado pelo Google.

**Relevance Engineering (r19g).** Termo de Mike King (2025): cruzamento de recuperação de informação, UX, IA, estratégia de conteúdo e PR digital para ter visibilidade em todos os tipos de busca. `[FONTE: iPullRank]`

**Entity SEO (SEO de entidades).** Otimizar em torno de "coisas" e relações (negócio, pessoa, serviço, cidade), não de strings. Declara-se com schema JSON-LD, `sameAs`, `@id` e consistência de nome, endereço e telefone.

**Knowledge graph.** Grafo de entidades e relações que o buscador e as IAs usam para desambiguar. O query fan-out devolve também pontos do Knowledge Graph `[FONTE: Mike King, entrevista SMX]`.

**Topical authority.** O buscador favorece quem cobre o assunto inteiro com profundidade, não quem repete a palavra-chave `[VENDOR]`.

**Topical map (Gübür).** Cinco fundamentos: source context, entidade central, intenção central de busca, seção central e seção externa. O link interno liga as duas seções e transfere autoridade `[FONTE secundária, A CONFIRMAR]`.
- **Source context**: por que esta marca tem o direito de falar disso. Para o Dove: negócio local que prova experiência com dados reais.

**Brand SERP.** A página de resultados de quando alguém busca o nome da marca. Quem controla essa página controla a primeira impressão e o que a IA diz sobre o negócio.

**Understandability, Credibility, Deliverability (UCD).** Barnard, 2019, marca registrada da Kalicube `[FONTE: Kalicube, sem verificação independente]`:
1. **Understandability**: a máquina entende quem é o negócio, o que faz, para quem.
2. **Credibility**: provas de experiência, autoridade e confiança (E-E-A-T) espalhadas pela web.
3. **Deliverability**: a informação certa chega no formato certo onde o público busca.

**Citado versus recomendado.** Estudo da Lily Ray (abr a jun/2026, 100 buscas "melhor [categoria]"): um listicle de autopromoção foi citado e **não recomendado em cerca de 69% dos casos**. Quem é recomendado tem muito mais domínios apontando e mais menções em AI Overviews e ChatGPT `[FONTE secundária, A CONFIRMAR]`. Conclusão: contar citações como KPI engana. Mede-se **recomendação e menção de marca**.

**Abertura com resposta direta.** Começar a seção com uma afirmação definitiva elevou a taxa de citação em 14% no estudo do Kevin Indig com ChatGPT `[FONTE secundária, A CONFIRMAR]`. Reforça a Regra 3 do ANCOREO (H2 autossuficiente).

**Cuidado com envenenamento de fonte.** Lily Ray inventou uma atualização do Google que nunca existiu, plantou em posts de IA e, em 24 horas, AI Overviews e Perplexity já citavam como fato `[FONTE secundária]`. Para a Wiki: **nunca repetir dado de IA sem fonte primária**.

---

## 3. O que o Google diz (via resumos, não lido na fonte)

- Para aparecer em AI Overviews e AI Mode **não há requisito técnico extra**: valem as boas práticas de SEO. Não há schema especial de IA nem exigência de `llms.txt` `[FONTE: página "AI features and your website", conteúdo cortado]`. Isso confirma a decisão do ANCOREO de tratar `llms.txt` como baixa prioridade.
- AI Overviews só aparecem quando o Google julga que acrescentam algo à busca comum, por isso muitas vezes não disparam.
- AI Mode e AI Overviews podem usar modelos diferentes, então os links mostrados variam.
- O tráfego dessas funções entra nos números gerais do Search Console. Uma fonte de terceiros diz que em jun/2026 surgiu um **relatório de desempenho de IA generativa** no Search Console, começando por um subconjunto de sites no Reino Unido `[A CONFIRMAR: ver se já chegou ao Brasil]`.
- Estudo da Ahrefs (via terceiros): um AI Overview reduziu em 58% os cliques para o primeiro resultado `[VENDOR]`.

### 3.1 Novidades do Google em 2026 que mudam o trabalho

**Ranking local (oficial, Central de Ajuda do Perfil de Empresa).** O Google diz que o resultado local depende de três fatores: **relevância** (o perfil combina com a busca), **distância** (da localização citada na busca ou da posição do usuário) e **destaque** (quão conhecido o negócio é, offline e online: links, artigos, diretórios). Diz também, com todas as letras, que **número e nota das avaliações entram no ranking local**. Um negócio mais longe pode ganhar de um mais perto se o Google julgar que ele responde melhor `[FONTE: support.google.com/business/answer/7091]`.

**Relatório de IA generativa no Search Console.** Lançado em 3/jun/2026, primeiro para parte dos sites no Reino Unido. Mostra **só impressões** em AI Overviews e AI Mode (sem cliques, CTR, posição ou consulta). Dados a partir de 18/mai/2026, sem histórico. Não soma impressões novas, só separa parte das que já existiam `[FONTE secundária, A CONFIRMAR se chegou ao Brasil]`.

**Filtro de consultas de marca no Search Console.** Anunciado em nov/2025 e liberado para todos os sites elegíveis em mar/2026. Separa busca pelo nome da marca de busca genérica. O Google usa IA para classificar e avisa que erra `[FONTE secundária]`.
> Para o cliente: é a métrica mais honesta de "a marca está crescendo". Busca de marca subindo = palestra, Instagram e Perfil funcionando.

**Preferred Sources (Fontes preferidas).** O usuário marca um site como fonte preferida. Desde mai/2026, quando esse site aparece citado em AI Overview ou AI Mode, ganha um selo "Preferido". Mais de 600 mil fontes já foram escolhidas e o clique numa fonte preferida é cerca de 2 vezes maior, segundo o Google. Há um botão oficial para pôr no site. Ainda não se sabe se vira fator de ranking `[FONTE secundária, fontes divergem]`.

**Personal Intelligence no AI Mode.** O AI Mode pode usar Gmail e outros apps do usuário para personalizar a resposta. Duas pessoas na mesma cidade, mesma busca, recebem respostas diferentes. Posição única no ranking vira métrica fraca `[FONTE secundária]`.

**Agentes de busca e comércio.** Google anunciou agentes que acompanham a web por conta do usuário (planos pagos). Recomendação recorrente: manter Perfil de Empresa, horários, preços e feeds do Merchant Center **exatos e legíveis por máquina**, porque o agente lê direto da fonte `[FONTE secundária]`.

**Diretrizes dos avaliadores de qualidade (jan/2025).** Conteúdo principal todo ou quase todo gerado por IA, sem valor acrescentado, recebe a **nota mais baixa**. Entrou também o conceito de **"filler"** (enchimento): texto que infla a página e atrasa a resposta útil pode levar nota baixa mesmo sem ser nocivo. Avaliadores não ranqueiam, mas treinam e validam o algoritmo `[FONTE secundária]`.

**Política de spam vale para IA.** Abuso de conteúdo em escala (março/2024) vale para conteúdo feito por gente ou por IA: o problema é escala com intenção de manipular, não a ferramenta. Relato de mai/2026 diz que as políticas de spam valem também para AI Overviews e AI Mode `[A CONFIRMAR]`.
> Para o ANCOREO e para os blogs dos clientes: gerar texto com IA é permitido. Publicar em volume sem dado real, sem voz do cliente e sem revisão é o que derruba.

**Checklist da Aleyda Solis (atualizado em mai/2026).** Organiza o trabalho em quatro estados de uma marca na resposta da IA: **visível, citada, recomendada ou ausente**. E em quais páginas próprias e de terceiros moldam essa resposta `[FONTE: aleydasolis.com]`.

---

## 4. Checklist novo para posicionar um cliente

Aplicar além dos 8 Passos do Posicionamento Orgânico:

1. **Mapa de subconsultas**: para cada serviço, listar as 8 a 12 perguntas vizinhas e dar um bloco autossuficiente a cada uma.
2. **Entidade primeiro**: nome, endereço, telefone, `sameAs` (Google Perfil, Instagram, LinkedIn, Wikidata se houver), `@id` estável no JSON-LD.
3. **Brand SERP**: buscar o nome do cliente e anotar o que aparece nas 10 primeiras posições. O que está errado ou ausente vira tarefa.
4. **Topical map**: seção central (serviços e cidade) e seção externa (dúvidas, glossário, casos), ligadas por link interno.
5. **Um trecho, uma ideia**: parágrafos curtos sob subtítulo descritivo, resposta na primeira frase.
6. **Medir recomendação, não só citação**: buscar "melhor [serviço] em [cidade]" em ChatGPT, Gemini, Perplexity e AI Overviews uma vez por mês e registrar se a marca é **recomendada**, só citada ou ausente.
7. **Fonte primária ou nada**: dado de IA sem origem não entra em artigo.
8. **Avaliações como fator de ranking**: o Google confirma que número e nota entram no ranking local. Rotina de pedido de avaliação (Passo 3) deixa de ser "boa prática" e vira obrigação.
9. **Busca de marca no Search Console**: ligar o filtro de consultas de marca e acompanhar mês a mês. É a prova de que a palestra e as redes estão gerando demanda.
10. **Dados exatos para agentes**: horário, telefone, preço e serviços iguais no site, no Perfil e nas redes. Agente de IA não perdoa divergência.
11. **Sem enchimento**: cortar introdução longa. Resposta primeiro, contexto depois.

---

## 5. Lacunas entre esta pesquisa e o ANCOREO (para decisão do Cássio)

- O **mapa de subconsultas** (query fan-out) não existe como etapa do gerador de blog. Hoje o ANCOREO exige H2 autossuficiente e FAQ de 6 ou mais perguntas, que cobre parte disso.
- O score AEO ainda usa amostra sintética (item 7 do PAINEL). A medição de **citado versus recomendado** do estudo da Lily Ray seria o desenho natural da medição real.
- Não há verificação de **Brand SERP** nem de `sameAs` no validador. É barato de checar.

Nada disso foi implementado. São sugestões.

---

## 6. Perguntas em aberto (precisam de acesso que faltou)

- Perfis do LinkedIn: habilidades listadas, certificações, posts recentes.
- Texto original do Google sobre AI features, Search Essentials, guia de dados estruturados e diretrizes de qualidade.
- Capítulos do AI Search Manual (iPullRank), principalmente recuperação neural e agentes.
- Conteúdo real dos cursos do Google.

## 7. Cursos do Google

O Google **não tem** um curso nem certificado só de SEO. A trilha recomendada, em ordem:

| Ordem | Material | Custo | Idioma |
|---|---|---|---|
| 1 | **Guia de introdução ao SEO** (SEO Starter Guide) e **Search Essentials** no Search Central | grátis | tem PT-BR |
| 2 | **Central de Ajuda do Search Console** e canal **Google Search Central** no YouTube | grátis | parte em PT |
| 3 | **Princípios do marketing digital** (Skillshop / Grow with Google), acreditado pelo IAB | grátis | PT |
| 4 | **Certificado Profissional Marketing Digital e E-commerce do Google** (Coursera), cobre Search Console e GA4 | assinatura Coursera, verificar preço | **PT-BR** |
| 5 | **Skillshop**: Google Analytics e Perfil de Empresa | grátis | PT |

Endereços: `grow.google/intl/pt/courses-and-tools/` e `skillshop.withgoogle.com/intl/pt-BR_ALL/`. Os cursos não foram feitos nem lidos aqui, só localizados.

## Fontes

- [Top 18 SEO Experts to Follow in 2026 (Demandsage)](https://www.demandsage.com/top-seo-experts/)
- [Top GEO Experts (Kopp Online Marketing)](https://www.kopp-online-marketing.com/top-generative-engine-optimierung-experts-for-llmo)
- [Best GEO Experts 2026 (Marketing Signals)](https://marketingsignals.com/best-generative-engine-optimisation-experts-2026/)
- [AI features and your website (Google Search Central)](https://developers.google.com/search/docs/appearance/ai-features)
- [Query Fan-Out, Latent Intent, and Source Aggregation (iPullRank)](https://ipullrank.com/ai-search-manual/query-fan-out)
- [The Evolution of Information Retrieval (iPullRank)](https://ipullrank.com/ai-search-manual/ir-evolution)
- [Mike King on relevance engineering (Search Engine Land)](https://searchengineland.com/mike-king-smx-advanced-2025-interview-456186)
- [Understandability Credibility Deliverability (Kalicube)](https://kalicube.com/entity/understandability-credibility-deliverability)
- [Topical Authority (Holistic SEO)](https://www.holisticseo.digital/?p=4946)
- [Entrevista Andrea Volpini (Sitechecker)](https://sitechecker.pro/interview-andrea-volpini/)
- [Entrevista Koray Gübür (Sitechecker)](https://sitechecker.pro/interview-koray-tugberk-gubur/)
- [SEOs Diners Club: estudo de 98 mil citações](https://seosdinersclub.beehiiv.com/p/seos-diners-club-215-why-is-ai-ignoring-you-98-000-citation-rows-have-the-answer)
- [Self-promotional Listicles Help Competitors Win AI Search](https://letsdatascience.com/news/self-promotional-listicles-help-competitors-win-ai-search-94bd402d)
- [Semantic SEO: Entity Architecture (seostrategy.co.uk)](https://www.seostrategy.co.uk/guide/semantic-search/)
- [How to improve your local ranking on Google (Google)](https://support.google.com/business/answer/7091?hl=en)
- [Quality raters now assess AI-generated content (Search Engine Land)](https://searchengineland.com/google-quality-raters-content-ai-generated-454161)
- [March 2024 core update and spam policies (Google)](https://developers.google.com/search/blog/2024/03/core-update-spam-policies)
- [GSC Generative AI report (Neil Patel)](https://neilpatel.com/blog/gsc-ai-search-data-generative-ai-report/)
- [GSC AI performance reports, the clicks problem (Crawlraven)](https://crawlraven.com/blog/gsc-ai-performance-reports)
- [Branded queries filter to all sites (SEO Sherpa)](https://seosherpa.com/google-expands-search-console-branded-queries-filter-to-all-eligible-sites/)
- [Preferred Sources in AI Mode (9to5Google)](https://9to5google.com/2026/05/27/google-ai-mode-preferred-sources/)
- [Personal Intelligence in AI Mode (ALM Corp)](https://almcorp.com/blog/google-personal-intelligence-ai-mode-complete-guide/)
- [Google I/O 2026: SEO e GEO (Passionfruit)](https://www.getpassionfruit.com/blog/google-i-o-2026-every-announcement-and-what-it-means-for-seo-and-geo)
- [AI Search Optimization Checklist (Aleyda Solis)](https://aleydasolis.com/en/ai-search/ai-search-optimization-checklist)
- [Grow with Google, cursos em português](https://grow.google/intl/pt/courses-and-tools/)
- [Certificado Marketing Digital e E-commerce do Google (Coursera)](https://www.coursera.org/professional-certificates/marketing-digital-e-e-commerce-do-google)
- [Query Fan-Out (Ekamoira)](https://www.ekamoira.com/blog/query-fan-out-original-research-on-how-ai-search-multiplies-every-query-and-why-most-brands-are-invisible)
