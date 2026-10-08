'use client'

import { useCallback, useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

// As quatro seções que o painel de Textos edita. Fica aqui (e não no
// CustomizationPanel) porque a busca precisa saber quais tipos filtrar.
export const SECTIONS = ['hero', 'about', 'services', 'faq']

export type SectionContent = Record<string, unknown>
export type SectionMap = Record<string, SectionContent | null>

type Estado = {
  pageId: string | null
  sections: SectionMap
  /** Quantas seções a home tem no total, incluindo tipos que o editor não mostra. */
  total: number
  loading: boolean
  erro: boolean
}

const VAZIO: Estado = { pageId: null, sections: {}, total: 0, loading: true, erro: false }

/**
 * Carrega, DE UMA VEZ SÓ, o id da home e o conteúdo de todas as seções dela.
 *
 * Antes cada acordeão do painel montava um SectionEditor que buscava sozinho:
 * primeiro `pages` (para descobrir o id), depois `sections` — duas idas ao
 * servidor encadeadas, repetidas a cada abertura, e a mesma linha de `pages`
 * buscada quatro vezes. Abrir uma seção custava ~1,8s.
 *
 * Aqui é uma requisição só (a home vem com as seções aninhadas pelo próprio
 * PostgREST) e o resultado vive no pai. Abrir o acordeão passa a ser troca de
 * estado, não busca.
 */
export function useHomeSections(siteId: string) {
  const [estado, setEstado] = useState<Estado>(VAZIO)
  const [chave, setChave] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()

    async function carregar() {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from('pages')
          .select('id, sections(section_type, content, order_index)')
          .eq('site_id', siteId)
          .eq('slug', 'home')
          .abortSignal(ctrl.signal)
          .maybeSingle()

        if (ctrl.signal.aborted) return
        if (error) throw error

        const linhas = ((data?.sections ?? []) as {
          section_type: string
          content: SectionContent | null
          order_index: number | null
        }[])
          .slice()
          .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))

        // Primeira linha de cada tipo vence: seções duplicadas por um editor
        // antigo compartilham o conteúdo, então a de menor order_index serve.
        const sections: SectionMap = {}
        for (const linha of linhas) {
          if (!SECTIONS.includes(linha.section_type)) continue
          if (sections[linha.section_type] === undefined) sections[linha.section_type] = linha.content ?? null
        }

        setEstado({
          pageId: data?.id ?? null,
          sections,
          total: linhas.length,
          loading: false,
          erro: false,
        })
      } catch (e) {
        // AbortError não é falha: é a limpeza do effect (StrictMode roda duas vezes).
        if (ctrl.signal.aborted) return
        console.error('[useHomeSections] falha ao carregar as seções da home', e)
        setEstado({ ...VAZIO, loading: false, erro: true })
      }
    }

    setEstado(e => ({ ...e, loading: true, erro: false }))
    void carregar()
    return () => ctrl.abort()
  }, [siteId, chave])

  /** Refaz a busca. Usar depois de gerar conteúdo com IA. */
  const recarregar = useCallback(() => setChave(k => k + 1), [])

  /** Espelha no cache do pai o que uma seção acabou de salvar. */
  const atualizarSecao = useCallback((sectionType: string, content: SectionContent) => {
    setEstado(e => ({ ...e, sections: { ...e.sections, [sectionType]: content } }))
  }, [])

  return { ...estado, recarregar, atualizarSecao }
}
