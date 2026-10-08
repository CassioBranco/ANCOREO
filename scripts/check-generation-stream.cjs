// Run: node scripts/check-generation-stream.cjs (uses the installed TypeScript).
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const source = fs.readFileSync(path.join(__dirname, '../lib/editor/generation-stream.ts'), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const moduleValue = { exports: {} }
new Function('exports', 'module', compiled)(moduleValue.exports, moduleValue)
const { readSiteGeneration } = moduleValue.exports

function stream(text, chunkSize = 1) {
  const bytes = new TextEncoder().encode(text)
  return new Response(new ReadableStream({
    start(controller) {
      for (let index = 0; index < bytes.length; index += chunkSize) controller.enqueue(bytes.slice(index, index + chunkSize))
      controller.close()
    },
  }))
}

async function main() {
  await readSiteGeneration(stream('data: {"text":"ação e coração"}\r\n\r\ndata: {"done":true}\r\n\r\n'))
  await readSiteGeneration(stream(': keepalive\n\ndata: {"text":"um campo chamado error"}\n\ndata: {"done":true}', 13))
  await assert.rejects(readSiteGeneration(stream('data: {"text":"conteúdo parcial"}\n\n')), /interrompida/)
  await assert.rejects(readSiteGeneration(stream('data: {"error":"Não foi salvo: \\"falha\\""}\n\n'.replace(/\\\\/g, '\\'))), /Não foi salvo/)
  await assert.rejects(readSiteGeneration(stream('data: invalid\n\n')), /inválida/)
  await assert.rejects(readSiteGeneration(new Response('{"error":"Limite diário"}', { status: 429 })), /Limite diário/)
  await assert.rejects(readSiteGeneration(new Response(null)), /não retornou/)
  await assert.rejects(readSiteGeneration(stream('data: null\n\n')), /inválida/)
  console.log('8 cenários passaram: fragmentação UTF-8, CRLF, sucesso, erro e interrupção.')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
