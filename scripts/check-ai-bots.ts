// ============================================================
// Checagem da detecção de robôs de IA (métrica de AEO, item 20).
//
// Roda com: npx tsx scripts/check-ai-bots.ts
//
// Existe porque o erro aqui é silencioso nos dois sentidos: um navegador
// comum contado como IA infla o número que o cliente vê, e um robô real
// que escapa some do gráfico sem ninguém perceber.
// ============================================================
import { detectAiBot } from '../lib/seo/ai-bots'

let falhas = 0
const ok = (nome: string, cond: boolean, extra = '') => {
  if (!cond) { falhas++; console.log('FALHOU:', nome, extra) }
  else console.log('ok   :', nome, extra)
}
const dono = (ua: string | null) => detectAiBot(ua)?.dono ?? null

// Robôs reais, com o user-agent completo que eles mandam.
ok('GPTBot', dono('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot') === 'ChatGPT')
ok('ChatGPT-User', dono('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot') === 'ChatGPT')
ok('ClaudeBot', dono('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)') === 'Claude')
ok('Claude-User', dono('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)') === 'Claude')
ok('PerplexityBot', dono('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)') === 'Perplexity')
ok('Meta', dono('meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)') === 'Meta AI')
ok('Amazonbot', dono('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36 (Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)') === 'Amazon')

// Googlebot é busca, não IA: conta à parte.
const g = detectAiBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
ok('Googlebot é detectado', g?.dono === 'Google')
ok('Googlebot não conta como IA', g?.ia === false)

// Gente de verdade não pode virar robô.
ok('Chrome desktop', dono('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36') === null)
ok('Safari iPhone', dono('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1') === null)
ok('Android', dono('Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36') === null)
ok('sem user-agent', dono(null) === null && dono('') === null)

if (falhas) { console.log(`\n${falhas} falha(s).`); process.exit(1) }
console.log('\nTudo certo.')
