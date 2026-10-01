// ============================================================
// Checagem das regras de "a IA não apaga o trabalho do dono" (MVP 2.2).
//
// Roda com: npx tsx scripts/check-ai-sections.ts
//
// Existe porque o erro aqui é perda de dado silenciosa: o dono clica em
// "Preencher tudo com IA" e o texto que ele corrigiu, a foto que ele subiu
// e os depoimentos reais somem, sem aviso nenhum.
// ============================================================
import { planAiSectionWrites, type AiSection, type ExistingSection } from '../lib/sites/ai-sections'

let falhas = 0
const ok = (nome: string, cond: boolean, extra = '') => {
  if (!cond) { falhas++; console.log('FALHOU:', nome, extra) }
  else console.log('ok   :', nome, extra)
}

const gerado: AiSection[] = [
  { section_type: 'hero', order_index: 0, content: { title: 'Título da IA', subtitle: 'Sub da IA' } },
  { section_type: 'about', order_index: 1, content: { text: 'Sobre da IA' } },
  { section_type: 'services', order_index: 2, content: { items: [{ name: 'Serviço IA' }] } },
  { section_type: 'testimonials', order_index: 3, content: { items: [] } },
  { section_type: 'faq', order_index: 4, content: { items: [] } },
]
const tipo = (w: AiSection[], t: string) => w.find(s => s.section_type === t)

// 1. Site novo, nada no banco: grava tudo, inclusive o bloco de depoimento vazio.
{
  const { writes, kept } = planAiSectionWrites([], gerado)
  ok('site novo grava os 5 blocos', writes.length === 5 && kept.length === 0)
  ok('site novo cria depoimento vazio', JSON.stringify(tipo(writes, 'testimonials')?.content) === '{"items":[]}')
}

// 2. Dono editou o "sobre" à mão, subiu foto no hero e cadastrou depoimento.
const existente: ExistingSection[] = [
  { section_type: 'hero', locked: false, content: { title: 'Velho', image: 'https://cdn/x.webp', cta_phone: '(15) 99999-0000' } },
  { section_type: 'about', locked: true, content: { text: 'Escrito pelo dono' } },
  { section_type: 'testimonials', locked: false, content: { items: [{ name: 'Maria', text: 'Ótimo' }] } },
  { section_type: 'services', locked: null, content: { items: [] } },
]
{
  const { writes, kept } = planAiSectionWrites(existente, gerado)
  ok('bloco travado não é regravado', !tipo(writes, 'about') && kept.includes('about'))
  ok('depoimento existente não é regravado', !tipo(writes, 'testimonials') && kept.includes('testimonials'))
  const hero = tipo(writes, 'hero')?.content as Record<string, unknown> | undefined
  ok('hero ganha o texto novo da IA', hero?.title === 'Título da IA')
  ok('hero mantém a foto do dono', hero?.image === 'https://cdn/x.webp')
  ok('hero mantém o telefone do dono', hero?.cta_phone === '(15) 99999-0000')
  ok('locked null conta como livre', !!tipo(writes, 'services'))
  ok('bloco que não existia é criado', !!tipo(writes, 'faq'))
}

// 3. A IA nunca consegue pôr foto: se o dono não subiu, não aparece campo vazio.
{
  const { writes } = planAiSectionWrites([{ section_type: 'hero', locked: false, content: { title: 'x' } }], gerado)
  const hero = tipo(writes, 'hero')?.content as Record<string, unknown>
  ok('sem foto do dono, hero não ganha image', !('image' in hero))
}

if (falhas) { console.log(`\n${falhas} falha(s).`); process.exit(1) }
console.log('\nTudo certo.')
