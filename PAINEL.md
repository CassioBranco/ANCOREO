# PAINEL — em que passo estamos

> **ARQUIVO GERADO. Não edite à mão.** Rode `node scripts/planilha.mjs`.
> Para abrir no Excel: **PAINEL.csv**, na mesma pasta.
> Última geração: **2026-10-08**

`████████████░░░░░░░░` **59%** — 16 de 27 itens do MVP prontos
**3 itens dependem de você** para destravar

A coluna **como sabemos** é o que separa esta planilha de uma lista de desejos.
_Verificado no código_ quer dizer que um teste automático achou a coisa
funcionando de verdade. _Plano_ quer dizer que combinamos fazer, e só.

## Onboarding — 2/3

| nº | o que é | situação | como sabemos | quando |
|---:|---|---|---|---|
| 1 | Fluxo de onboarding existe e grava perfil | PRONTO | verificado no código | feito |
| 27 | Descobrir por que 9 sites são gerados e só 2 são publicados (6 eram teste; falha sem motivo e publicação sem lista corrigidas) | PRONTO | plano | R2 · 13/10 a 24/10 |
| 28 | Opção Enterprise: sai do fluxo normal e cai no e-mail institucional | falta | plano | R2 · 13/10 a 24/10 |

## Site builder — 3/7

| nº | o que é | situação | como sabemos | quando |
|---:|---|---|---|---|
| 2 | Geração de site por IA está ligada ao onboarding | PRONTO | verificado no código | feito |
| 3 | Publicação de site tem rota e chamador | PRONTO | verificado no código | feito |
| 4 | Resposta direta abaixo do título (o trecho que a IA copia ao citar) | PRONTO | verificado no código | feito |
| 23 | Tela de domínio próprio no painel (hoje o cliente não tem onde apontar o DNS) | falta | plano | R2 · 13/10 a 24/10 |
| 24 | Content-Signal: separar "pode me citar" de "pode me usar pra treinar" | falta | plano | R3 · 27/10 a 07/11 |
| 25 | Site lento não publica (trava acima de 2,5 segundos) | falta | plano | R3 · 27/10 a 07/11 |
| 26 | Avisar quando uma página fica a mais de 3 cliques da home | falta | plano | R3 · 27/10 a 07/11 |

## Blog builder — 1/2

| nº | o que é | situação | como sabemos | quando |
|---:|---|---|---|---|
| 5 | Editor de post chama a rota de publicação de blog | PRONTO | verificado no código | feito |
| 29 | Publicar 5 posts de verdade e conferir os links entre eles | falta | plano | R3 · 27/10 a 07/11 |

## Métricas de SEO, GEO e AEO — 4/5

| nº | o que é | situação | como sabemos | quando |
|---:|---|---|---|---|
| 6 | Painel lê score real da API (não hardcoded) | PRONTO | verificado no código | feito |
| 7 | Score é persistido em histórico (score_snapshots) | PRONTO | verificado no código | feito |
| 8 | AEO usa medição real, sem amostra sintética na interface | PRONTO | verificado no código | feito |
| 9 | Visitas de robô de IA são contadas no site do cliente | PRONTO | verificado no código | feito |
| 22 | Posição real das palavras-chave, puxada do Search Console | falta | plano | R3 · 27/10 a 07/11 |

## Google Perfil — 6/10

| nº | o que é | situação | como sabemos | quando |
|---:|---|---|---|---|
| 10 | Existe integração com a API do Google (OAuth + publicação) | falta | verificado no código | esperando o Google liberar |
| 11 | Rascunho de post do Google é gerado por IA | PRONTO | verificado no código | feito |
| 12 | Cliente registra que publicou no perfil (published_at é escrito) | PRONTO | verificado no código | feito |
| 13 | Calendário do mês: posts saem com data marcada | PRONTO | verificado no código | feito |
| 14 | Link do Perfil é lido, guardado com place_id e vinculável no painel | PRONTO | verificado no código | feito |
| 15 | Lembrete semanal do post sai sozinho (rota + agendamento) | PRONTO | verificado no código | feito |
| 16 | Ponte blog ↔ Perfil: artigo publicado vira post, post vira pauta | PRONTO | verificado no código | feito |
| 19 | Você rodar o teste seco do robô (?seco=1) com o CRON_SECRET na mão | **ESPERANDO VOCÊ** | plano | agora |
| 20 | Você aprovar o texto do e-mail semanal do Perfil (portão G1) | **ESPERANDO VOCÊ** | plano | agora |
| 21 | Sessão de teste T5: publicar um post no seu Perfil de verdade, 20 min | **ESPERANDO VOCÊ** | plano | agora |

## Fora do MVP — 0/3

| nº | o que é | situação | como sabemos | quando |
|---:|---|---|---|---|
| 17 | Loja: botão de compra ligado ao checkout | falta | verificado no código | depois do lançamento |
| 18 | Loja: painel de produtos existe | falta | verificado no código | depois do lançamento |
| 30 | Cobrança da assinatura (o beta é grátis, então não corre) | fora do MVP | plano | depois do lançamento |

---

Detalhe técnico do que está ligado: [ESTADO.md](ESTADO.md) ·
O que mudou e quando: [DIARIO.md](DIARIO.md) ·
Definição de pronto: [MVP.md](MVP.md)
