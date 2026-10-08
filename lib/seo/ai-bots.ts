// ============================================================
// ANCOREO — Robôs de IA e de busca
// Uma lista só, usada em dois lugares:
//  • app/robots.ts libera todos eles (AEO Regra 1);
//  • o middleware conta a visita de cada um no site do cliente (medição real
//    de "as IAs estão lendo meu site", sem API paga).
// Sem dependência de Node — roda no edge runtime do middleware.
// ============================================================

export type AiBot = {
  /** token do user-agent, como aparece no robots.txt */
  ua: string
  /** quem opera o robô, em linguagem de cliente */
  dono: string
  /** false = robô de busca tradicional (Googlebot); true = robô de IA */
  ia: boolean
}

// Ordem importa na detecção: o mais específico antes do genérico
// (ex.: "Claude-SearchBot" antes de "ClaudeBot" não colide, mas mantemos o
// hábito). Tokens que só existem no robots.txt (Google-Extended,
// Applebot-Extended) ficam na lista pra serem liberados, mesmo sem nunca
// aparecerem num user-agent.
export const AI_BOTS: readonly AiBot[] = [
  { ua: 'GPTBot', dono: 'ChatGPT', ia: true },
  { ua: 'OAI-SearchBot', dono: 'ChatGPT', ia: true },
  { ua: 'ChatGPT-User', dono: 'ChatGPT', ia: true },
  { ua: 'Google-Extended', dono: 'Gemini', ia: true },
  { ua: 'Googlebot', dono: 'Google', ia: false },
  { ua: 'Anthropic-AI', dono: 'Claude', ia: true },
  { ua: 'Claude-SearchBot', dono: 'Claude', ia: true },
  { ua: 'Claude-User', dono: 'Claude', ia: true },
  { ua: 'Claude-Web', dono: 'Claude', ia: true },
  { ua: 'ClaudeBot', dono: 'Claude', ia: true },
  { ua: 'PerplexityBot', dono: 'Perplexity', ia: true },
  { ua: 'Perplexity-User', dono: 'Perplexity', ia: true },
  { ua: 'Applebot-Extended', dono: 'Apple', ia: true },
  { ua: 'YouBot', dono: 'You.com', ia: true },
  { ua: 'cohere-ai', dono: 'Cohere', ia: true },
  { ua: 'meta-externalagent', dono: 'Meta AI', ia: true },
  { ua: 'Bytespider', dono: 'TikTok', ia: true },
  { ua: 'Amazonbot', dono: 'Amazon', ia: true },
]

/** Robô que fez a requisição, ou null se for gente (ou robô que não nos interessa). */
export function detectAiBot(userAgent: string | null | undefined): AiBot | null {
  if (!userAgent) return null
  const ua = userAgent.toLowerCase()
  return AI_BOTS.find(b => ua.includes(b.ua.toLowerCase())) ?? null
}
