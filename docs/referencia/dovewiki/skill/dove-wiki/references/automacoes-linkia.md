# Automações — LINKIA

## Plataforma
- **URL:** linkia.ai
- **Canais:** WhatsApp API + email marketing
- **Variável de nome:** `{{contact.name}}`
- **Tempo mínimo de espera:** 1 minuto (sem opção de segundos)

## Tagging de Campanhas
Formato: `[niche]-palestra-[data]`
- Ex: `corretor-palestra-28abr`
- Ex: `eng-palestra-15mai`

## Pipelines Ativos
- Arquitetos
- Corretores (reaproveitamento dos stages de arquitetos)
- Engenheiros (mapeado, em construção)

## Regras Críticas

**Trigger de automação:**
- Só dispara para leads adicionados APÓS publicação do fluxo
- Leads pré-existentes não são capturados — nunca

**Envio de link com preview no WhatsApp:**
Enviar SEMPRE em 3 blocos separados:
1. Texto completo do convite (sem nenhum link)
2. Link isolado (sozinho no bloco)
3. Mensagem curta de urgência

**Filosofia de automação do Dove:**
- Fluxos lineares — evitar ramificações A/B/C/D desnecessárias
- Duplicar blocos de SMS para diferentes caminhos = complexidade que não precisa existir
- Se há dúvida se um split é necessário: provavelmente não é

## Estrutura Padrão de Fluxo (pós-evento)
1. Imediato: mensagem de agradecimento + link de inscrição
2. +1 dia: lembrete com prova social (case relevante ao nicho)
3. +3 dias: última chamada (scarcity real — vagas restantes)
4. +7 dias (não inscritos): convite para próximo evento ou lista de espera
