'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { EVT_INLINE_CONTENT, EVT_PANEL_DRAFT, EVT_PANEL_SAVED } from '@/lib/editor/inline-edit'

type Props = {
  siteId: string
  /** Id da home, já carregado pelo pai (useHomeSections). */
  pageId: string | null
  sectionType: string
  niche: string
  /** Conteúdo desta seção, vindo do carregamento único do pai. */
  initialContent: SectionContent | null | undefined
  onSaved: () => void
  /** Espelha no cache do pai o que foi salvo aqui. */
  onContentChange?: (sectionType: string, content: SectionContent) => void
}

type SectionContent = Record<string, unknown>

// Blindagem contra linha malformada: algumas seções antigas gravaram o payload
// INTEIRO do site (com sub-objetos hero/about/… aninhados) no lugar do objeto
// plano da própria seção. Nesse caso o editor lia content.headline (=undefined)
// e mostrava campos vazios (as "barras cinzas"). Se o content tem um sub-objeto
// com o próprio section_type e NÃO tem as chaves planas esperadas, desaninha.
// A seção correta nunca tem uma chave igual ao seu tipo, então isto é seguro.
function unwrapMalformed(sectionType: string, raw: SectionContent): SectionContent {
  const nested = raw[sectionType]
  const isNestedObj =
    !!nested && typeof nested === 'object' && !Array.isArray(nested) &&
    Object.keys(nested as object).length > 0
  if (!isNestedObj) return raw
  const inner = { ...(nested as SectionContent) }
  // Preserva a imagem que ficou no topo do blob (o aninhado não a tem).
  if (inner.image == null && raw.image != null) inner.image = raw.image
  return inner
}

type FaqItem = { question: string; answer: string }

type ServiceItem = { name: string; description: string; icon?: string }

export default function SectionEditor({
  siteId, pageId, sectionType, niche, initialContent, onSaved, onContentChange,
}: Props) {
  const [content, setContent] = useState<SectionContent | null>(
    initialContent ? unwrapMalformed(sectionType, initialContent) : null,
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMode, setAiMode] = useState<'block' | 'page' | null>(null)
  // Geração de descrição por item (serviços/produtos): índice em andamento e índice com erro
  const [genIdx, setGenIdx] = useState<number | null>(null)
  const [genErrIdx, setGenErrIdx] = useState<number | null>(null)

  // O componente fica montado o tempo todo (o acordeão só esconde), então o
  // que o dono digitou e ainda não salvou sobrevive a fechar e reabrir. Só
  // aceitamos conteúdo novo do pai quando ele REALMENTE muda de objeto — o
  // caso do "Preencher tudo com IA", que reescreve tudo por fora.
  const ultimoDoPai = useRef(initialContent)
  // Mudança que veio de fora (pai ou edição inline) não volta pro preview como rascunho.
  const veioDeFora = useRef(true)
  useEffect(() => {
    if (initialContent === ultimoDoPai.current) return
    ultimoDoPai.current = initialContent
    veioDeFora.current = true
    setContent(initialContent ? unwrapMalformed(sectionType, initialContent) : null)
  }, [initialContent, sectionType])

  // Edição inline no preview → espelha aqui (aba Textos) sem reload.
  useEffect(() => {
    const onInline = (e: Event) => {
      const d = (e as CustomEvent).detail as { sectionType?: string; content?: SectionContent } | null
      if (d?.sectionType === sectionType && d.content) {
        veioDeFora.current = true
        setContent(unwrapMalformed(sectionType, d.content))
      }
    }
    window.addEventListener(EVT_INLINE_CONTENT, onInline)
    return () => window.removeEventListener(EVT_INLINE_CONTENT, onInline)
  }, [sectionType])

  // Digitando na aba Textos → o preview acompanha na hora; o banco só grava no blur.
  useEffect(() => {
    if (veioDeFora.current) { veioDeFora.current = false; return }
    if (!content) return
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVT_PANEL_DRAFT, { detail: { sectionType, content } }))
    }, 120)
    return () => clearTimeout(t)
  }, [content, sectionType])

  // locked: true quando o dono escreveu à mão, false quando aceitou um texto
  // da IA. Bloco travado é pulado pelo "Preencher tudo com IA" (ai-sections.ts).
  async function save(updated: SectionContent, locked = true) {
    if (!pageId) { setSaveError('A página ainda não foi carregada. Tente novamente.'); return }
    setSaving(true)
    setSaveError('')
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from('sections')
        .update({ content: updated, locked })
        .eq('page_id', pageId)
        .eq('section_type', sectionType)
        .select('id')
      if (error || !data?.length) throw new Error('Conteúdo não salvo. Tente novamente.')
      onContentChange?.(sectionType, updated)
      // avisa a ponte de edição: o preview espelha o texto novo sem reload
      window.dispatchEvent(new CustomEvent(EVT_PANEL_SAVED, { detail: { sectionType, content: updated } }))
      onSaved()
    } catch {
      setSaveError('Conteúdo não salvo. Seu texto continua aqui; tente salvar novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function rewriteWithAI(scope: 'block' | 'page') {
    setAiLoading(true)
    setAiMode(scope)
    const endpoint = scope === 'block' ? '/api/ai/text' : '/api/ai/page'
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_id: siteId, section_type: sectionType, niche }),
      })
      if (!res.ok) throw new Error('Falha na IA')
      const { content: updated } = await res.json()
      if (updated) {
        setContent(updated)
        await save(updated, false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setAiLoading(false)
      setAiMode(null)
    }
  }

  if (!content) {
    return (
      <>
        <p className="ed-hint">Conteúdo ainda não gerado.</p>
        <button onClick={() => rewriteWithAI('block')} disabled={aiLoading} className="ed-ai sm">
          {aiLoading ? 'Gerando…' : <><i className="ph-fill ph-sparkle ai-spark" /> Gerar com IA</>}
        </button>
      </>
    )
  }

  const editableFields = getEditableFields(sectionType, content)

  // ── FAQ: lista de pergunta/resposta editável ──
  // Essas perguntas aparecem na seção de FAQ do site E no widget de chat
  // flutuante (balão no canto inferior direito do site publicado).
  const isFaq = sectionType === 'faq'
  const faqItems: FaqItem[] = isFaq && Array.isArray(content.items)
    ? (content.items as FaqItem[])
    : []

  function setFaqField(idx: number, key: keyof FaqItem, value: string) {
    setContent(prev => {
      const items = Array.isArray(prev?.items) ? [...(prev!.items as FaqItem[])] : []
      items[idx] = { ...items[idx]!, [key]: value }
      return { ...prev!, items }
    })
  }

  function addFaq() {
    const next = { ...content!, items: [...faqItems, { question: '', answer: '' }] }
    setContent(next)
    void save(next)
  }

  function removeFaq(idx: number) {
    const next = { ...content!, items: faqItems.filter((_, i) => i !== idx) }
    setContent(next)
    void save(next)
  }

  // ── Serviços/produtos: lista de itens editável, com "Gerar com IA" por descrição ──
  const isServices = sectionType === 'services'
  const svcItems: ServiceItem[] = isServices && Array.isArray(content.items)
    ? (content.items as ServiceItem[])
    : []

  function setSvcField(idx: number, key: 'name' | 'description', value: string) {
    setContent(prev => {
      const items = Array.isArray(prev?.items) ? [...(prev!.items as ServiceItem[])] : []
      items[idx] = { ...items[idx]!, [key]: value }
      return { ...prev!, items }
    })
  }

  function addSvc() {
    const next = { ...content!, items: [...svcItems, { name: '', description: '' }] }
    setContent(next)
    void save(next)
  }

  function removeSvc(idx: number) {
    const next = { ...content!, items: svcItems.filter((_, i) => i !== idx) }
    setContent(next)
    void save(next)
  }

  // Gera a descrição de UM item a partir do nome + palavras-chave já digitadas
  // no campo. Botão fica desabilitado enquanto gera (proteção contra clique
  // repetido) e mostra "Erro, tente de novo" em falha, sem quebrar o editor.
  async function generateDescription(idx: number) {
    if (genIdx !== null) return
    const item = svcItems[idx]
    if (!item) return
    setGenErrIdx(null)
    setGenIdx(idx)
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          name: item.name ?? '',
          keywords: item.description ?? '',
        }),
      })
      if (!res.ok) throw new Error('Falha na IA')
      const { description } = await res.json() as { description?: string }
      if (!description) throw new Error('Resposta vazia')
      const items = [...svcItems]
      items[idx] = { ...items[idx]!, description }
      const next = { ...content!, items }
      setContent(next)
      await save(next)
    } catch (e) {
      console.error(e)
      setGenErrIdx(idx)
    } finally {
      setGenIdx(null)
    }
  }

  return (
    <>
      {saveError && <p className="ed-err" role="alert">{saveError}</p>}
      {isFaq && (
        <>
          <p className="ed-hint" style={{ marginTop: 0 }}>
            As perguntas aparecem na seção de FAQ e no balão de chat flutuante do site.
          </p>
          {faqItems.map((item, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--line)', borderRadius: 10,
                padding: '.6rem .65rem', marginBottom: '.6rem',
                display: 'flex', flexDirection: 'column', gap: '.45rem',
              }}
            >
              <div className="ed-field-group">
                <label className="lbl" style={{ margin: 0 }}>Pergunta {i + 1}</label>
                <input
                  className="field"
                  type="text"
                  value={item.question ?? ''}
                  placeholder="Ex.: Quais são as formas de pagamento?"
                  onChange={e => setFaqField(i, 'question', e.target.value)}
                  onBlur={() => save({ ...content })}
                />
              </div>
              <div className="ed-field-group">
                <label className="lbl" style={{ margin: 0 }}>Resposta</label>
                <textarea
                  className="field"
                  value={item.answer ?? ''}
                  rows={3}
                  style={{ resize: 'vertical' }}
                  placeholder="Responda de forma direta e completa."
                  onChange={e => setFaqField(i, 'answer', e.target.value)}
                  onBlur={() => save({ ...content })}
                />
              </div>
              <button
                onClick={() => removeFaq(i)}
                style={{
                  alignSelf: 'flex-end', background: 'none', cursor: 'pointer',
                  border: '1px solid var(--line)', borderRadius: 8,
                  padding: '.25rem .6rem', fontSize: '.72rem', color: 'var(--muted)',
                }}
              >
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={addFaq}
            disabled={saving}
            style={{
              width: '100%', background: 'none', cursor: 'pointer',
              border: '1px dashed var(--line)', borderRadius: 10,
              padding: '.55rem', fontSize: '.78rem', color: 'var(--muted)',
              marginBottom: '.7rem',
            }}
          >
            + Adicionar pergunta
          </button>
        </>
      )}

      {isServices && (
        <>
          <p className="ed-hint" style={{ marginTop: 0 }}>
            Itens da seção de serviços/produtos do site. Digite algumas
            palavras-chave na descrição (ou só o nome) e use &quot;Gerar com IA&quot;.
          </p>
          {svcItems.map((item, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--line)', borderRadius: 10,
                padding: '.6rem .65rem', marginBottom: '.6rem',
                display: 'flex', flexDirection: 'column', gap: '.45rem',
              }}
            >
              <div className="ed-field-group">
                <label className="lbl" style={{ margin: 0 }}>Nome {i + 1}</label>
                <input
                  className="field"
                  type="text"
                  value={item.name ?? ''}
                  placeholder="Ex.: Limpeza de pele profunda"
                  onChange={e => setSvcField(i, 'name', e.target.value)}
                  onBlur={() => save({ ...content })}
                />
              </div>
              <div className="ed-field-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
                  <label className="lbl" style={{ margin: 0 }}>Descrição</label>
                  <button
                    onClick={() => generateDescription(i)}
                    disabled={genIdx !== null || (!(item.name ?? '').trim() && !(item.description ?? '').trim())}
                    className="ed-ai sm"
                    style={{ width: 'auto', padding: '.3rem .55rem' }}
                    title="Gera a descrição a partir do nome e das palavras-chave do campo. Você pode editar depois."
                  >
                    {genIdx === i
                      ? 'Gerando…'
                      : genErrIdx === i
                        ? 'Erro, tente de novo'
                        : <><i className="ph-fill ph-sparkle ai-spark" /> Gerar com IA</>}
                  </button>
                </div>
                <textarea
                  className="field"
                  value={item.description ?? ''}
                  rows={3}
                  style={{ resize: 'vertical' }}
                  placeholder="Escreva a descrição ou digite palavras-chave e clique em Gerar com IA."
                  onChange={e => setSvcField(i, 'description', e.target.value)}
                  onBlur={() => save({ ...content })}
                />
              </div>
              <button
                onClick={() => removeSvc(i)}
                style={{
                  alignSelf: 'flex-end', background: 'none', cursor: 'pointer',
                  border: '1px solid var(--line)', borderRadius: 8,
                  padding: '.25rem .6rem', fontSize: '.72rem', color: 'var(--muted)',
                }}
              >
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={addSvc}
            disabled={saving}
            style={{
              width: '100%', background: 'none', cursor: 'pointer',
              border: '1px dashed var(--line)', borderRadius: 10,
              padding: '.55rem', fontSize: '.78rem', color: 'var(--muted)',
              marginBottom: '.7rem',
            }}
          >
            + Adicionar item
          </button>
        </>
      )}

      {editableFields.map(({ key, label, multiline }) => {
        const value = String(content[key] ?? '')
        return (
          <div key={key} className="ed-field-group">
            <label className="lbl" style={{ margin: 0 }}>{label}</label>
            {multiline ? (
              <textarea
                className="field"
                value={value}
                rows={3}
                style={{ resize: 'vertical' }}
                onChange={e => setContent(prev => ({ ...prev!, [key]: e.target.value }))}
                onBlur={() => save({ ...content })}
              />
            ) : (
              <input
                className="field"
                type="text"
                value={value}
                onChange={e => setContent(prev => ({ ...prev!, [key]: e.target.value }))}
                onBlur={() => save({ ...content })}
              />
            )}
          </div>
        )
      })}

      {saving && <p className="ed-saving">Salvando…</p>}

      <div style={{ display: 'flex', gap: '.5rem', borderTop: '1px solid var(--line)', paddingTop: '.7rem' }}>
        <button onClick={() => rewriteWithAI('block')} disabled={aiLoading} className="ed-ai sm" style={{ flex: 1 }}>
          {aiLoading && aiMode === 'block' ? 'Reescrevendo…' : <><i className="ph-fill ph-sparkle ai-spark" /> Reescrever bloco</>}
        </button>
        <button
          onClick={() => rewriteWithAI('page')}
          disabled={aiLoading}
          className="btn glass sm"
          style={{ flex: 1 }}
          title="Regerar a página toda com IA"
        >
          {aiLoading && aiMode === 'page' ? 'Regerando…' : <><i className="ph-fill ph-sparkle ai-spark" /> Página toda</>}
        </button>
      </div>
    </>
  )
}

function getEditableFields(
  sectionType: string,
  content: SectionContent
): { key: string; label: string; multiline: boolean }[] {
  switch (sectionType) {
    case 'hero':
      return [
        { key: 'headline', label: 'Título principal', multiline: false },
        { key: 'sub', label: 'Subtítulo', multiline: true },
        { key: 'answer', label: 'Resposta direta (40 a 60 palavras: quem é, o que faz, onde)', multiline: true },
        { key: 'cta_label', label: 'Botão CTA', multiline: false },
      ]
    case 'about':
      return [
        { key: 'title', label: 'Título da seção', multiline: false },
        { key: 'body', label: 'Texto sobre o negócio', multiline: true },
        { key: 'credential', label: 'Credencial / autoridade', multiline: false },
      ]
    case 'services':
      return []
    case 'faq':
      return []
    default:
      return Object.keys(content)
        .filter(k => typeof content[k] === 'string')
        .map(k => ({ key: k, label: k, multiline: String(content[k]).length > 80 }))
  }
}
