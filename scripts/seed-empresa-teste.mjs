// ============================================================
// Empresa de TESTE — cria (ou apaga) um negócio completo e falso
// pra exercitar o produto ponta a ponta sem tocar em cliente real.
//
//   node scripts/seed-empresa-teste.mjs           cria/atualiza
//   node scripts/seed-empresa-teste.mjs --limpar  apaga tudo
//
// Por que existe: hoje o banco tem 13 tenants e 1 site publicado, e o
// único publicado é de cliente de verdade. Testar a ponte blog -> Google
// Perfil exige um site COM domínio e PUBLICADO (a rota /do-artigo monta
// a URL pública do artigo e devolve 409 sem domínio). Sem esta semente,
// testar significaria mexer no site do cliente. Com ela, o teste é
// descartável: rode com --limpar e não sobra rastro.
//
// Idempotente: rodar duas vezes não duplica nada.
// ============================================================
import { readFileSync, existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}
const db = createClient(URL, KEY, { auth: { persistSession: false } })

// ── Identidade da empresa de teste ───────────────────────────
// O nome do tenant começa com TESTE de propósito: se um dia esta linha
// aparecer num relatório ou numa cobrança, dá pra ver na hora que não é
// cliente. Domínio em .ancoreo.com.br pra parecer com o mundo real.
const EMAIL   = 'empresa-teste@ancoreo.com.br'
const TENANT  = 'TESTE — Padaria Pão Quente (nao e cliente)'
const DOMINIO = 'empresa-teste.ancoreo.com.br'

const limpar = process.argv.includes('--limpar')

async function acharAuthUser() {
  // Não existe getUserByEmail no client; a base é pequena, listar resolve.
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) throw new Error(`listUsers: ${error.message}`)
  return data.users.find(u => u.email?.toLowerCase() === EMAIL) ?? null
}

async function limparTudo() {
  const { data: tenant } = await db.from('tenants').select('id').eq('name', TENANT).maybeSingle()
  if (tenant) {
    const t = tenant.id
    // Ordem importa: filhos antes dos pais.
    for (const tabela of ['gbp_posts', 'blog_posts', 'pages', 'onboarding_profiles', 'audit_logs', 'score_snapshots', 'leads', 'sites', 'users']) {
      const { error } = await db.from(tabela).delete().eq('tenant_id', t)
      if (error) console.log(`  aviso: ${tabela} -> ${error.message}`)
    }
    await db.from('tenants').delete().eq('id', t)
    console.log('tenant de teste apagado')
  } else {
    console.log('nao havia tenant de teste')
  }

  const user = await acharAuthUser()
  if (user) {
    const { error } = await db.auth.admin.deleteUser(user.id)
    console.log(error ? `  aviso: deleteUser -> ${error.message}` : 'login de teste apagado')
  }
  console.log('\nLimpo.')
}

async function semear() {
  // 1. Login. Sem senha: a entrada é pelo /dev-login (só roda em dev).
  //    email_confirm evita o e-mail de confirmação sair pra um endereço
  //    que não existe.
  let user = await acharAuthUser()
  if (!user) {
    const { data, error } = await db.auth.admin.createUser({
      email: EMAIL,
      email_confirm: true,
      user_metadata: { nome: 'Dono da Padaria (teste)' },
    })
    if (error) throw new Error(`createUser: ${error.message}`)
    user = data.user
    console.log('login criado   :', EMAIL)
  } else {
    console.log('login ja existia:', EMAIL)
  }

  // 2. Tenant.
  let { data: tenant } = await db.from('tenants').select('*').eq('name', TENANT).maybeSingle()
  if (!tenant) {
    const daqui90 = new Date(Date.now() + 90 * 864e5).toISOString()
    const { data, error } = await db.from('tenants')
      .insert({ name: TENANT, plan: 'pro', trial_ends_at: daqui90, sites_allowed: 3 })
      .select().single()
    if (error) throw new Error(`tenants: ${error.message}`)
    tenant = data
    console.log('tenant criado  :', tenant.id)
  } else {
    console.log('tenant existia :', tenant.id)
  }

  // 3. Vínculo login -> tenant.
  const { error: eUser } = await db.from('users')
    .upsert({ id: user.id, tenant_id: tenant.id, role: 'owner' }, { onConflict: 'id' })
  if (eUser) throw new Error(`users: ${eUser.message}`)

  // 4. Site. PUBLICADO e COM domínio: é isso que a ponte blog -> Google
  //    Perfil precisa pra montar https://dominio/blog/slug.
  let { data: site } = await db.from('sites').select('*').eq('domain', DOMINIO).maybeSingle()
  const camposSite = {
    tenant_id: tenant.id,
    domain: DOMINIO,
    preset: 'servicos',
    niche: 'alimentacao',
    template: 'portfolio',
    font_pair: 'classico',
    palette_index: 0,
    palette_name: 'Ambar',
    palette: {
      name: 'Ambar',
      group: 'Quentes',
      colors: ['#B45309', '#D97706', '#F59E0B', '#FFFFFF', '#FFFBEB', '#3B2405', '#8A6B3A'],
    },
    status: 'published',
    booking_enabled: false,
    leads_enabled: true,
  }
  if (!site) {
    const { data, error } = await db.from('sites').insert(camposSite).select().single()
    if (error) throw new Error(`sites: ${error.message}`)
    site = data
    console.log('site criado    :', DOMINIO)
  } else {
    await db.from('sites').update(camposSite).eq('id', site.id)
    console.log('site existia   :', DOMINIO)
  }

  // 5. Perfil do onboarding, preenchido de verdade. Perfil raso faz a IA
  //    gerar texto genérico, e aí o teste não prova nada.
  const perfil = {
    tenant_id: tenant.id,
    site_id: site.id,
    business_name: 'Padaria Pão Quente',
    niche: 'alimentacao',
    city: 'Sorocaba',
    state: 'SP',
    service_radius_km: 8,
    differentials: 'Padaria de bairro em Sorocaba com fornada de pão francês de hora em hora, bolo caseiro por encomenda e café da manhã servido das 6h às 11h. Massa de fermentação natural e entrega no bairro.',
    target_audience: 'Moradores e trabalhadores da região central de Sorocaba que compram pão no dia e encomendam bolo para aniversário.',
    pain_points: 'Cliente não sabe o horário das fornadas e acaba comprando pão frio no mercado.',
    years_experience: 12,
    tone: 'proximo',
    objetivo: 'institucional',
    setor: 'alimentacao',
    profissao: 'Padeiro',
    porte: 'micro_pequena',
    area_tipo: 'local',
    gbp_connected: false,
    // 'sem' e honesto: nao existe Perfil do Google de verdade atras disso.
    // Marcar 'vincular' com link falso quebraria as telas que confiam nele.
    gpe_modo: 'sem',
    completeness_score: 100,
    conhecimento: [
      { pergunta: 'Que horas sai a fornada de pão francês?', resposta: 'De hora em hora, das 6h às 19h. A primeira sai às 6h em ponto.' },
      { pergunta: 'Vocês fazem bolo por encomenda?', resposta: 'Sim, com 48 horas de antecedência. Bolo caseiro, recheado e de festa.' },
      { pergunta: 'Tem entrega?', resposta: 'Entregamos nos bairros vizinhos, pedido mínimo de R$ 30.' },
    ],
    social_links: {},
    dominio_modo: 'subdominio',
    dominio: DOMINIO,
  }
  const { data: perfilExistente } = await db.from('onboarding_profiles')
    .select('id').eq('tenant_id', tenant.id).maybeSingle()
  if (perfilExistente) {
    const { error } = await db.from('onboarding_profiles').update(perfil).eq('id', perfilExistente.id)
    if (error) throw new Error(`onboarding_profiles: ${error.message}`)
    console.log('perfil atualizado')
  } else {
    const { error } = await db.from('onboarding_profiles').insert(perfil)
    if (error) throw new Error(`onboarding_profiles: ${error.message}`)
    console.log('perfil criado')
  }

  // 6. Duas páginas publicadas. Artigo novo precisa de página pra apontar
  //    (o grafo de links internos religa tudo na publicação); site sem
  //    página nenhuma faz o artigo nascer órfão e o teste vira falso
  //    negativo.
  const paginas = [
    { slug: 'home', title: 'Padaria Pão Quente em Sorocaba | Pão fresco de hora em hora', meta_description: 'Padaria de bairro em Sorocaba com fornada de pão francês a cada hora, bolo por encomenda e café da manhã das 6h às 11h. Entrega na região.', intent: 'transacional' },
    { slug: 'encomendas', title: 'Bolo por encomenda em Sorocaba | Padaria Pão Quente', meta_description: 'Bolo caseiro e de festa por encomenda em Sorocaba, com 48h de antecedência. Recheios tradicionais e entrega nos bairros vizinhos.', intent: 'transacional' },
  ]
  for (const p of paginas) {
    const { data: existe } = await db.from('pages')
      .select('id').eq('site_id', site.id).eq('slug', p.slug).maybeSingle()
    if (existe) continue
    const { error } = await db.from('pages')
      .insert({ ...p, site_id: site.id, tenant_id: tenant.id, published: true })
    if (error) console.log(`  aviso: pages/${p.slug} -> ${error.message}`)
  }

  // 7. Conteúdo da home. Sem seções o site "publicado" era uma casca: o
  //    editor abria vazio, tentava gerar e a rota recusava por estar no ar.
  const { data: home } = await db.from('pages')
    .select('id').eq('site_id', site.id).eq('slug', 'home').maybeSingle()
  if (home) {
    const secoes = [
      { section_type: 'hero', content: {
        headline: 'Padaria Pão Quente em Sorocaba',
        sub: 'Pão francês saindo do forno de hora em hora, bolo por encomenda e café da manhã das 6h às 11h.',
        cta_label: 'Quero Encomendar', cta_phone: '' } },
      { section_type: 'about', content: {
        body: 'A Padaria Pão Quente atende o bairro há 18 anos com fornada de pão francês a cada hora, das 6h às 20h. A massa descansa a noite toda, por isso a casca estala e o miolo fica leve. Além do balcão, fazemos bolo caseiro e de festa por encomenda, com 48 horas de antecedência, e entregamos nos bairros vizinhos de Sorocaba.' } },
      { section_type: 'services', content: { items: [
        { icon: '', name: 'Pão francês de hora em hora', description: 'Fornada nova a cada hora, das 6h às 20h. Você chega e o pão está quente.' },
        { icon: '', name: 'Bolo por encomenda', description: 'Bolo caseiro e de festa com 48h de antecedência. Recheios tradicionais e de época.' },
        { icon: '', name: 'Café da manhã', description: 'Mesa de café das 6h às 11h, com pão na chapa, tapioca e suco natural.' },
      ] } },
      { section_type: 'testimonials', content: { items: [
        { name: 'Marta L.', text: 'O pão das 7h é o melhor da região. Compro todo dia antes do trabalho.', rating: 5 },
        { name: 'Rogério P.', text: 'Encomendei o bolo do aniversário da minha filha e chegou no horário, do jeito que pedi.', rating: 5 },
      ] } },
      { section_type: 'faq', content: { items: [
        { question: 'Qual o horário da padaria?', answer: 'Abrimos todos os dias das 6h às 20h. O café da manhã é servido das 6h às 11h.' },
        { question: 'Com quanto tempo preciso encomendar um bolo?', answer: 'Com 48 horas de antecedência. Bolos de festa acima de 3 kg pedem 72 horas.' },
        { question: 'Vocês entregam?', answer: 'Sim, nos bairros vizinhos de Sorocaba. A taxa depende da distância.' },
      ] } },
      { section_type: 'meta', content: {
        title: 'Padaria Pão Quente em Sorocaba | Pão fresco de hora em hora',
        description: 'Padaria de bairro em Sorocaba com pão francês de hora em hora, bolo por encomenda e café da manhã das 6h às 11h. Entrega na região.',
        keywords: ['padaria em Sorocaba', 'bolo por encomenda Sorocaba', 'pão francês Sorocaba', 'café da manhã Sorocaba'] } },
    ]
    const linhas = secoes.map((x, i) => ({ ...x, order_index: i, page_id: home.id, tenant_id: tenant.id }))
    const { error } = await db.from('sections').upsert(linhas, { onConflict: 'page_id,section_type', ignoreDuplicates: true })
    if (error) console.log(`  aviso: sections -> ${error.message}`)
    else console.log('seções da home ok')
  }

  console.log(`
──────────────────────────────────────────────
Empresa de teste pronta.

  Negócio : Padaria Pão Quente (Sorocaba/SP)
  Login   : ${EMAIL}
  Site    : https://${DOMINIO}  (status: publicado)

Pra entrar, com o servidor rodando em dev:

  http://localhost:3000/dev-login?email=${EMAIL}&next=/blog

Pra apagar tudo depois:

  node scripts/seed-empresa-teste.mjs --limpar
──────────────────────────────────────────────`)
}

try {
  await (limpar ? limparTudo() : semear())
} catch (e) {
  console.error('\nFALHOU:', e.message)
  process.exit(1)
}
