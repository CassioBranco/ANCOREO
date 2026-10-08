-- ANCOREO — Blog abre com resposta direta de 40 a 60 palavras (item 23 do MVP).
--
-- O prompt do agente blog pedia "Introdução direta em 2-3 frases": sem
-- tamanho, a introdução saía curta demais pra responder ou longa demais pra a
-- IA copiar inteira. A regra nova é a mesma régua da home (hero.answer) e a
-- que o validador confere (lib/seo/validator.ts, regra resposta-primeiro):
-- o primeiro parágrafo responde o título sozinho, em 40 a 60 palavras. O
-- JSON-LD do artigo aponta esse parágrafo como speakable.
--
-- Mesmo padrão da 20260805130000: UPDATE com replace() sobre o texto vivo,
-- lido do banco antes de escrever o alvo. Idempotente: depois da 1ª vez não
-- sobra o texto antigo pra trocar.

UPDATE prompt_templates
SET content = replace(
  content,
  '- Introdução direta em 2-3 frases.',
  '- Primeiro parágrafo = RESPOSTA DIRETA ao título, em 40 a 60 palavras, citável sozinho (é o trecho que a IA copia ao citar o artigo).'
)
WHERE scope = 'agent'
  AND agent = 'blog'
  AND content LIKE '%- Introdução direta em 2-3 frases.%';
