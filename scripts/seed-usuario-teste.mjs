// ============================================================
// Usuário de TESTE — conta zerada pra percorrer o produto como um
// cliente novo: login com senha -> onboarding -> site -> blog -> métricas.
//
//   node scripts/seed-usuario-teste.mjs            cria (ou reaproveita) e mostra onde está a senha
//   node scripts/seed-usuario-teste.mjs --zerar    apaga sites/conteúdo e volta pro começo do onboarding
//   node scripts/seed-usuario-teste.mjs --limpar   apaga tudo, inclusive o login
//
// Diferença pra seed-empresa-teste.mjs: aquela já nasce com site publicado
// (pra testar a ponte blog -> Google Perfil). Esta nasce vazia, pra testar
// o caminho que o cliente faz do zero.
//
// A senha NÃO é impressa no terminal: vai pra teste-login.local.md
// (ignorado pelo git). Cada --zerar/criação gera senha nova.
// ============================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
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

// Nome do tenant começa com TESTE: se aparecer em relatório ou cobrança,
// dá pra ver na hora que não é cliente.
const EMAIL   = 'usuario-teste@ancoreo.com.br'
const TENANT  = 'TESTE — Usuário novo (nao e cliente)'
const ARQUIVO = 'teste-login.local.md'

const limpar = process.argv.includes('--limpar')
const zerar  = process.argv.includes('--zerar')

// Senha que passa no medidor de força da tela de login (maiúscula,
// minúscula, número, símbolo, 12+).
function novaSenha() {
  const corpo = randomBytes(9).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 10)
  return `Teste-${corpo}9a!`
}

async function acharAuthUser() {
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) throw new Error(`listUsers: ${error.message}`)
  return data.users.find(u => u.email?.toLowerCase() === EMAIL) ?? null
}

async function acharTenant() {
  const { data } = await db.from('tenants').select('id').eq('name', TENANT).maybeSingle()
  return data
}

// Filhos antes dos pais. Tabela que não existe/sem tenant_id só gera aviso.
const CONTEUDO = ['gbp_posts', 'blog_posts', 'sections', 'pages', 'ia_generations', 'onboarding_profiles',
  'audit_logs', 'score_snapshots', 'leads', 'sites']

async function apagarConteudo(t) {
  for (const tabela of CONTEUDO) {
    const { error } = await db.from(tabela).delete().eq('tenant_id', t)
    if (error) console.log(`  aviso: ${tabela} -> ${error.message}`)
  }
}

function gravar(senha) {
  writeFileSync(ARQUIVO, `# Login de teste (NÃO versionar)

Conta zerada pra testar o produto como cliente novo.

- E-mail: ${EMAIL}
- Senha: ${senha}

Onde entrar:
- Produção: https://www.ancoreo.com.br/login
- Local: http://localhost:3000/login (ou http://localhost:3000/dev-login?email=${EMAIL}&next=/onboarding)

Voltar pro começo do onboarding: \`node scripts/seed-usuario-teste.mjs --zerar\`
Apagar tudo: \`node scripts/seed-usuario-teste.mjs --limpar\`
`, 'utf8')
}

async function main() {
  if (limpar) {
    const t = await acharTenant()
    if (t) {
      await apagarConteudo(t.id)
      await db.from('users').delete().eq('tenant_id', t.id)
      await db.from('tenants').delete().eq('id', t.id)
      console.log('tenant de teste apagado')
    }
    const u = await acharAuthUser()
    if (u) {
      const { error } = await db.auth.admin.deleteUser(u.id)
      console.log(error ? `  aviso: deleteUser -> ${error.message}` : 'login de teste apagado')
    }
    if (existsSync(ARQUIVO)) writeFileSync(ARQUIVO, '# Login de teste apagado.\n', 'utf8')
    console.log('Limpo.')
    return
  }

  const senha = novaSenha()

  // 1. Login com senha, e-mail já confirmado (nenhum e-mail sai).
  let user = await acharAuthUser()
  if (!user) {
    const { data, error } = await db.auth.admin.createUser({
      email: EMAIL, password: senha, email_confirm: true,
      user_metadata: { nome: 'Usuário de teste' },
    })
    if (error) throw new Error(`createUser: ${error.message}`)
    user = data.user
    console.log('login criado    :', EMAIL)
  } else {
    const { error } = await db.auth.admin.updateUserById(user.id, { password: senha, email_confirm: true })
    if (error) throw new Error(`updateUser: ${error.message}`)
    console.log('login ja existia:', EMAIL, '(senha renovada)')
  }

  // 2. Tenant no plano pro: a cota diária do starter acaba rápido em teste.
  let tenant = await acharTenant()
  if (!tenant) {
    const daqui90 = new Date(Date.now() + 90 * 864e5).toISOString()
    const { data, error } = await db.from('tenants')
      .insert({ name: TENANT, plan: 'pro', trial_ends_at: daqui90 })
      .select('id').single()
    if (error) throw new Error(`tenants: ${error.message}`)
    tenant = data
    console.log('tenant criado   :', tenant.id)
  } else {
    console.log('tenant existia  :', tenant.id)
  }

  const { error: eUser } = await db.from('users')
    .upsert({ id: user.id, tenant_id: tenant.id, role: 'owner' }, { onConflict: 'id' })
  if (eUser) throw new Error(`users: ${eUser.message}`)

  if (zerar) {
    await apagarConteudo(tenant.id)
    console.log('conteudo zerado : volta pro inicio do onboarding')
  }

  gravar(senha)
  console.log(`\nSenha gravada em ${ARQUIVO} (fora do git).`)
}

main().catch(e => { console.error(e.message); process.exit(1) })
