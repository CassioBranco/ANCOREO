// ============================================================
// Checagem da resposta direta abaixo do título (item 23 do MVP).
//
// Roda com: npx tsx scripts/check-resposta-direta.ts
//
// Existe porque a régua (40 a 60 palavras) mora em três lugares que precisam
// concordar: a nota do site (checagem resposta-direta), o validador do blog
// (resposta-primeiro) e o JSON-LD speakable. Se um deles mudar sozinho, o
// painel diz "ok" para um texto que a IA corta no meio.
// ============================================================
import { isDirectAnswer, firstParagraph } from '../lib/seo/score'
import { buildSiteScores } from '../lib/seo/site-score'
import { validateBlogPostForPublish } from '../lib/seo/validator'
import { speakableSpec, SPEAKABLE_HOME } from '../lib/seo/jsonld'
import { getExampleContent } from '../lib/templates/example-content'

let falhas = 0
const ok = (nome: string, cond: boolean, extra = '') => {
  if (!cond) { falhas++; console.log('FALHOU:', nome, extra) }
  else console.log('ok   :', nome, extra)
}
const palavras = (n: number) => Array.from({ length: n }, (_, i) => `p${i}`).join(' ')

// 1. Régua: limites exatos.
ok('39 palavras não passa', !isDirectAnswer(palavras(39)))
ok('40 palavras passa', isDirectAnswer(palavras(40)))
ok('60 palavras passa', isDirectAnswer(palavras(60)))
ok('61 palavras não passa', !isDirectAnswer(palavras(61)))
ok('vazio não passa', !isDirectAnswer(''))

// 2. Nota do site: checagem resposta-direta segue o campo hero.answer.
const nota = (answer?: string) => {
  const s = buildSiteScores({
    title: 'Clínica em Sorocaba', metaDescription: '', hasLinkTargets: false,
    sections: [{ section_type: 'hero', content: { headline: 'Clínica em Sorocaba', ...(answer ? { answer } : {}) } }],
  })
  return s.dimensions.find(d => d.key === 'aeo')?.checks.find(c => c.id === 'resposta-direta')
}
ok('sem resposta: checagem existe e falha', nota()?.ok === false)
ok('sem resposta: correção manda preencher no editor', /Preencha a "Resposta direta"/.test(nota()?.fix ?? ''))
ok('resposta de 50 palavras passa', nota(palavras(50))?.ok === true)
ok('resposta de 80 palavras falha e diz quantas tem', nota(palavras(80))?.ok === false && /80 palavras/.test(nota(palavras(80))?.fix ?? ''))

// 3. Blog: aviso resposta-primeiro olha o 1º parágrafo, e só avisa (não bloqueia).
const post = (lead: string) => validateBlogPostForPublish({ title: 'Como escolher', content: `<p>${lead}</p><h2>Outro</h2><p>texto</p>` })
const curto = post('Curto demais.')
ok('blog com 1º parágrafo curto gera aviso', curto.warnings.some(w => w.rule === 'resposta-primeiro'))
ok('aviso não vira erro (não trava publicação)', !curto.errors.some(e => e.rule === 'resposta-primeiro'))
ok('blog com 1º parágrafo de 45 palavras não avisa', !post(palavras(45)).warnings.some(w => w.rule === 'resposta-primeiro'))
ok('firstParagraph pega o 1º <p>', firstParagraph('<p>um dois</p><p>três</p>') === 'um dois')

// 4. speakable só existe quando há resposta.
ok('speakable ausente sem resposta', speakableSpec(SPEAKABLE_HOME, false) === undefined)
ok('speakable aponta .site-answer', JSON.stringify(speakableSpec(SPEAKABLE_HOME, true)) === '{"@type":"SpeakableSpecification","cssSelector":[".site-answer"]}')

// 5. Os exemplos da galeria respeitam a própria régua.
for (const preset of ['advocacia', 'clinica', 'restaurante', 'servicos', 'landing']) {
  const a = getExampleContent(preset).heroAnswer ?? ''
  ok(`exemplo ${preset} dentro da régua`, isDirectAnswer(a))
}

if (falhas) { console.log(`\n${falhas} falha(s).`); process.exit(1) }
console.log('\nTudo certo.')
