// Run: node scripts/check-generation-save.cjs. No network or database access.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const source = fs.readFileSync(path.join(__dirname, '../lib/sites/save-generated-sections.ts'), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const value = { exports: {} }
new Function('exports', 'module', compiled)(value.exports, value)
const { saveGeneratedSections } = value.exports
const generated = { hero: { headline: 'Novo' }, about: { body: 'Sobre' }, services: [], testimonials: [{ text: 'Inventado' }], faq: [], meta: { title: 'Título' } }
function database(failure) {
  const page = { id: 'home', site_id: 'site', tenant_id: 'tenant', slug: 'home', published: false }
  const sections = [
    { id: 't', section_type: 'testimonials', content: { items: [{ text: 'Real' }] }, order_index: 7 },
    { id: 'h', section_type: 'hero', content: { headline: 'Velho', image: 'manual.webp' }, order_index: 4 },
    { id: 'a', section_type: 'about', content: { body: 'Texto protegido' }, order_index: 2, locked: true },
  ]
  const db = { from(table) {
    let operation = 'read', payload, options
    const filters = []
    const q = {
      select() { return q }, eq(key, val) { filters.push([key, val]); return q },
      upsert(data, opts) { operation = 'upsert'; payload = data; options = opts; return q },
      update(data) { operation = 'update'; payload = data; return q },
      single() { return q },
      then(resolve, reject) { return Promise.resolve().then(() => {
        if (failure === `${table}:${operation}`) return { data: null, error: { message: 'Falha simulada' } }
        if (table === 'pages' && operation === 'upsert') {
          assert.equal(options.ignoreDuplicates, true, 'Existing publication must not be reset')
          return { data: null, error: null }
        }
        assert(filters.some(([key,val]) => key === 'tenant_id' && val === 'tenant') || operation === 'upsert')
        if (operation === 'read') return { data: table === 'pages' ? page : sections, error: null }
        if (table === 'pages') { Object.assign(page, payload); return { data: page, error: null } }
        for (const row of payload) {
          assert.equal(row.tenant_id, 'tenant')
          const existing = sections.find(s => s.section_type === row.section_type)
          if (existing) Object.assign(existing, row)
          else sections.push({ id: row.section_type, ...row })
        }
        return { data: payload.map(row => ({ id: row.section_type })), error: null }
      }).then(resolve,reject) },
    }
    return q
  } }
  return { db, page, sections }
}
async function main() {
  const { db, page, sections } = database()
  assert.equal(await saveGeneratedSections(db, 'site', 'tenant', generated), null)
  assert.equal(page.published, false)
  assert.equal(sections.find(s=>s.section_type==='testimonials').content.items[0].text, 'Real')
  assert.equal(sections.find(s=>s.section_type==='about').content.body, 'Texto protegido')
  const hero = sections.find(s=>s.section_type==='hero')
  assert.equal(hero.content.headline, 'Novo')
  assert.equal(hero.content.image, 'manual.webp')
  assert.equal(hero.order_index, 4)
  assert.equal(page.title, 'Título')
  for (const failure of ['pages:upsert', 'pages:read', 'sections:read', 'sections:upsert', 'pages:update']) {
    assert.equal(await saveGeneratedSections(database(failure).db, 'site', 'tenant', generated), 'Falha simulada')
  }
  const live = database()
  live.page.published = true
  const before = JSON.stringify(live.sections)
  assert.match(await saveGeneratedSections(live.db, 'site', 'tenant', generated), /apenas para rascunhos/)
  assert.equal(JSON.stringify(live.sections), before)
  assert.equal(live.page.published, true)
  const fresh = database()
  fresh.sections.splice(0)
  assert.equal(await saveGeneratedSections(fresh.db, 'site', 'tenant', generated), null)
  assert.deepEqual(fresh.sections.find(s=>s.section_type==='testimonials').content.items, [])
  console.log('Passou: bloqueio de página publicada, depoimentos reais, bloqueios, ordem, campos manuais, metadados e propagação de cinco falhas.')
}
main().catch(error=>{console.error(error);process.exitCode=1})
