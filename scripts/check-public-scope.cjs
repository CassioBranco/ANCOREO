const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const root = path.resolve(__dirname, '..')
const stage = root
const ts = require(root + '/node_modules/typescript')
const originalResolve = Module._resolveFilename
const originalLoad = Module._load
let host = 'cliente.exemplo'
const data = {
  sites: [{ id: 'site-a', tenant_id: 'tenant-a', domain: host, status: 'published', niche: 'servicos' }],
  blog_posts: [
    { id: 'good', tenant_id: 'tenant-a', site_id: 'site-a', slug: 'artigo', title: 'Correto', status: 'published' },
    { id: 'evil', tenant_id: 'tenant-b', site_id: 'site-a', slug: 'artigo', title: 'Cruzado', status: 'published' },
    { id: 'draft', tenant_id: 'tenant-a', site_id: 'site-a', slug: 'rascunho', title: 'Rascunho', status: 'draft' },
  ],
  pages: [
    { id: 'home', site_id: 'site-a', tenant_id: 'tenant-a', slug: 'home', published: true },
    { id: 'wrong', site_id: 'site-a', tenant_id: 'tenant-b', slug: 'intruso', published: true },
  ],
  sections: [
    { id: 'hero', page_id: 'home', tenant_id: 'tenant-a', section_type: 'hero', content: { headline: 'Correto' } },
    { id: 'fake', page_id: 'home', tenant_id: 'tenant-b', section_type: 'hero', content: { headline: 'Injetado' } },
  ],
  onboarding_profiles: [], images: [],
}
function client() {
  return { from(table) {
    const filters = []
    const query = {
      select(columns) { assert(!columns.includes('updated_at'), 'Do not query a nonexistent pages column'); return query },
      eq(key, value) { filters.push([key, value]); return query },
      order() { return query },
      maybeSingle() { const rows = result(); return Promise.resolve({ data: rows.length === 1 ? rows[0] : null, error: null }) },
      single() { return query.maybeSingle() },
      then(resolve, reject) { return Promise.resolve({ data: result(), error: null }).then(resolve, reject) },
    }
    function result() { return (data[table] || []).filter(row => filters.every(([key,value]) => row[key] === value)) }
    return query
  } }
}
Module._load = function (request, parent, isMain) {
  if (request === '@/lib/supabase/admin') return { createAdminClient: client }
  if (request === '@/lib/supabase/server') throw new Error('Public sitemap must not depend on visitor session')
  if (request === '@/lib/env') return { hasSupabaseEnv: () => true }
  if (request === 'next/headers') return { headers: () => ({ get: () => host }) }
  return originalLoad.call(this, request, parent, isMain)
}
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('@/')) {
    const rel=request.slice(2)
    request=fs.existsSync(path.join(stage,rel+'.ts')) ? path.join(stage,rel) : path.join(root,rel)
  }
  return originalResolve.call(this, request, parent, ...rest)
}
for (const extension of ['.ts','.tsx']) require.extensions[extension] = (module, file) => {
  module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText,file)
}
async function main() {
  const posts=require(path.join(stage,'lib/blog/posts.ts'))
  assert.equal((await posts.getPublishedPostBySlug(host,'artigo')).id,'good')
  assert.deepEqual((await posts.getPublishedPostsByDomain(host)).map(p=>p.title),['Correto'])
  assert.equal(await posts.getPublishedPostBySlug('outro.exemplo','artigo'),null)
  const { buildSiteContent }=require(path.join(stage,'lib/templates/build-site-content.ts'))
  const built=await buildSiteContent(client(),{domain:host})
  assert.equal(built.tenantId,'tenant-a')
  assert.deepEqual(built.sections.map(s=>s.id),['hero'])
  const sitemap=require(path.join(stage,'app/sitemap.ts')).default
  assert.deepEqual((await sitemap()).map(item=>item.url).sort(),['https://cliente.exemplo','https://cliente.exemplo/blog/artigo'])
  host='www.ancoreo.com.br'
  assert.equal((await sitemap()).length,1)
  data.sites[0].status='draft'
  assert.equal(await posts.getPublishedPostBySlug('cliente.exemplo','artigo'),null)
  console.log('8 verificações passaram: conta correta, conteúdo cruzado, rascunhos e sitemap anônimo.')
}
main().catch(error=>{console.error(error);process.exitCode=1})
