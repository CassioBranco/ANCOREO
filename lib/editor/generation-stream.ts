/** Contract of /api/generate/site: only done:true confirms persisted content. */
export async function readSiteGeneration(response: Response): Promise<void> {
  if (!response.ok) {
    const text = await response.text()
    let message = text
    try { message = JSON.parse(text).error || text } catch { /* plain-text HTTP error */ }
    throw new Error(message || 'Não foi possível gerar o conteúdo.')
  }
  if (!response.body) throw new Error('A geração não retornou conteúdo.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let completed = false
  function event(frame: string) {
    const data = frame.split(/\r?\n/).filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trimStart()).join('\n')
    if (!data) return
    let payload: { error?: string; done?: boolean }
    try { payload = JSON.parse(data) } catch { throw new Error('Resposta inválida durante a geração. Tente novamente.') }
    if (!payload || typeof payload !== 'object') throw new Error('Resposta inválida durante a geração.')
    if (payload.error) throw new Error(payload.error)
    if (payload.done === true) completed = true
  }
  try {
    for (;;) {
      const { value, done } = await reader.read()
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
      let boundary: RegExpExecArray | null
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        event(buffer.slice(0, boundary.index))
        buffer = buffer.slice(boundary.index + boundary[0].length)
      }
      if (done) break
    }
    if (buffer.trim()) event(buffer)
    if (!completed) throw new Error('A geração foi interrompida antes de confirmar o salvamento. Tente novamente.')
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}
