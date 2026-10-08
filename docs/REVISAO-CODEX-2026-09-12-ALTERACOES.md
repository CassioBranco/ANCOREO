# ANCOREO — revisão e alterações para Cássio e Claude

Atualização: 12/09/2026. Trabalho aplicado no código local em `D:/ancoreo`, sem commit, deploy ou alteração do banco de produção. **A revisão completa ainda não está encerrada.** Este relatório atualiza o diagnóstico inicial desta sessão.

## Resultado desta etapa

O editor passou a apresentar uma ferramenta por vez: Conteúdo, Estilo ou Prévia ampla. A área do site ganhou espaço; a barra de score ficou recolhível. Essa organização segue a referência de interação da Hostinger escolhida por Cássio. É uma primeira reorganização do builder, não a conclusão da nova identidade visual da plataforma inteira.

Foram corrigidos problemas de confirmação de geração, tratamento de falhas de salvamento e leitura pública de conteúdo. A regeneração de rascunhos passou a preservar depoimentos reais, seções bloqueadas, ordem existente e campos manuais não substituídos pela IA. Sites já publicados recebem bloqueio explícito para evitar troca automática de conteúdo no ar. Os testes locais descritos abaixo passaram.

## Alterações implementadas

| Área | Alteração | Limite da validação |
|---|---|---|
| Organização do editor | Navegação compacta, um painel ativo, prévia ampla, score opcional e regras para telas estreitas. Controles recebem rótulos e estados de seleção. | Código e renderização estática verificados; revisão visual e interação real pendentes. |
| Geração no editor | Um leitor de eventos comum aos dois caminhos de geração, com suporte a dados fragmentados e caracteres acentuados. Só confirma sucesso quando recebe `done: true`; informa erros e interrupção. | Oito cenários simulados, sem chamada paga de IA. |
| Salvamento de estilo | Gravações enfileiradas; histórico e confirmação atualizados após resposta válida. Falhas aparecem no painel. | TypeScript e lint. Ainda precisa de teste real com latência e duas janelas. |
| Salvamento de seções | Erro de banco ou ausência de registro atualizado deixa de emitir confirmação falsa de sucesso. | TypeScript e lint; teste autenticado pendente. |
| Regeneração | Bloqueia sites publicados antes da chamada de IA e páginas publicadas antes da gravação. Em rascunhos, preserva depoimentos existentes, seções bloqueadas, ordem e campos manuais adicionais. Depoimentos novos começam vazios mesmo se a IA sugerir texto. Seções são gravadas em lote. Falhas de leitura, gravação e metadados retornam erro. | Teste com banco simulado, incluindo cinco pontos de falha. Não constitui teste transacional no PostgreSQL. |
| Registro de geração | Verifica posse do site por conta; não chama IA se falhar a criação do registro de geração. Marca `done` depois do salvamento das seções. | TypeScript/lint e revisão do fluxo; integração real pendente. |
| Conteúdo público | Resolução comum de site publicado e proprietário. Blog, catálogo, conteúdo do template, metadados, sitemap e llms.txt recebem filtros do proprietário em suas leituras principais. | Oito verificações simuladas de isolamento e sitemap. Não substitui correção de policies/FKs. |
| Sitemap | Leitura pública deixa de depender da sessão do visitante, usa site publicado e proprietário e remove consulta a coluna inexistente de páginas. Usa identificação comum do domínio da plataforma. | Testes simulados de visitante anônimo e domínio com www. |
| Marcação | Corrige aspas de texto e barras decorativas interpretadas pelo lint como comentários JSX. | Lint geral: zero erros; 55 avisos permanecem. |

Os componentes existentes foram reaproveitados. Não foi instalado framework de editor nem adicionada dependência ao projeto.

## O que os testes demonstram

- TypeScript completo: passou com `tsc --noEmit --incremental false`.
- ESLint completo sem cache: saída 0, **0 erros e 55 avisos**. Os avisos incluem imagens e dependências de hooks; não foram ocultados na configuração.
- `node scripts/check-generation-stream.cjs`: oito cenários passaram.
- `node scripts/check-public-scope.cjs`: oito verificações passaram, incluindo conta correta, conteúdo cruzado, rascunhos e sitemap sem sessão.
- `node scripts/check-generation-save.cjs`: preservação de dados manuais, bloqueios, ordem, bloqueio de página publicada e propagação de cinco falhas passaram.
- As quatro checagens existentes de links do Google Perfil, calendário, lembrete e integração blog→Google Perfil passaram. Foram executadas com o TypeScript já instalado, sem instalar pacotes nem enviar e-mails.
- A prévia HTML usa marcação real dos painéis e dados fictícios. Permite alternar a organização; não salva nem publica. A conexão com o navegador expirou nas tentativas de inspeção, portanto **não há aprovação visual**.

Não foram executados build de produção, Lighthouse, teste de pagamento ou fluxo completo de salvar/recarregar/publicar em conta autenticada. Os testes com banco simulado não provam o comportamento das policies ou gatilhos de produção.

## Pendências importantes antes de publicar as mudanças

1. **Permissões administrativas:** consultas de metadados no Supabase indicaram UPDATE de `tenants.plan` e `tenants.sites_allowed` por authenticated. Inspecionar gatilhos e restringir operações administrativas. Nenhuma tentativa de elevar plano foi feita.
2. **Integridade entre contas:** policies e FKs consultadas não garantem que o proprietário do registro filho seja o mesmo do pai. Os novos filtros públicos são proteção adicional; a correção no banco continua pendente. Validar duas contas em ambiente isolado e possíveis dados legados antes de migration.
3. **Custo de IA:** a leitura de `plan_quotas` pelo cliente de sessão pode falhar e liberar a geração; o blog não tem controle de quota equivalente. É necessária reserva atômica no servidor, antes de IA/RAG, com comportamento de erro definido. Isso não foi corrigido nesta etapa.
4. **Publicação e auditoria:** operações de publicação são separadas e registros em `audit_logs` podem falhar por RLS. Exigem revisão transacional e autorização apropriada.
5. **Rascunho versus conteúdo no ar:** o banco atual não fornece uma versão separada de rascunho para todas as alterações. A regeneração de sites publicados foi bloqueada no servidor nesta revisão. Para reabilitá-la, implementar uma versão de rascunho independente e publicação explícita. Outros salvamentos do editor ainda precisam dessa revisão de comportamento. Não apresentar “salvar” como garantia de que nada mudou no ar.
6. **Concorrência:** leitura e gravação da regeneração não são uma transação única. Outra sessão pode alterar bloqueios ou conteúdo entre elas. Metadados da página também são gravados separadamente. Desfazer, edição direta na prévia e troca de site ainda precisam de testes reais.
7. **Demais módulos:** distinguir falha de leitura de lista vazia; unificar seleção de site nas métricas; revisar promessas comerciais, números ilustrativos e mensagem sobre Google Perfil. Esses achados do diagnóstico inicial continuam pendentes.
8. **Identidade visual completa:** a referência Hostinger está definida. Faltam a aplicação consistente na landing e nas demais telas, avaliação de contraste, teclado, toque e uso em celular. A prévia do builder é parcial.
9. **Histórico e acesso:** o chat principal referido como Cloud/Claude não foi identificado. O histórico acessível de “ANCOREO design” não representa a conversa completa. O login do ANCOREO precisa da indicação de qual das três contas Google utilizar.

## Compartilhamento com o Claude

O ponto de encontro é o mesmo repositório e o arquivo `ANCOREO-COLABORACAO.md` na raiz. Este relatório também fica em `docs/REVISAO-CODEX-2026-09-12-ALTERACOES.md`. Há referências nos arquivos de instruções dos dois agentes.

Isso compartilha código, decisões e passagem de trabalho. Não sincroniza automaticamente os chats e não envia mensagem ao Claude. Os arquivos gerados PAINEL/ESTADO/DIARIO não foram reescritos manualmente.

Antes de continuar, examinar o diff atual. O repositório já continha mudanças de outras sessões; elas foram preservadas. As gravações desta etapa conferiram o conteúdo anterior de cada arquivo para evitar sobrescrever uma edição concorrente.

## Arquivos centrais para continuidade

- Editor: `app/(editor)/editor/[siteId]/page.tsx`, `components/EditorSidebar.tsx`, `components/panels/CustomizationPanel.tsx`, `components/panels/SectionEditor.tsx`, `app/(editor)/editor.css`.
- Geração: `lib/editor/generation-stream.ts`, `lib/sites/save-generated-sections.ts`, `app/api/generate/site/route.ts` e seus scripts de checagem.
- Leitura pública: `lib/sites/published.ts`, `lib/blog/posts.ts`, `lib/ecommerce/products.ts`, `lib/templates/build-site-content.ts`, `app/[domain]/page.tsx`, `app/sitemap.ts`, `app/llms.txt/route.ts`.
- Marcação: onboarding, SiteTemplate e layouts Academia, Acolhedor, Bold, Clean, Conversao e Jovem.

Próxima etapa: resolver os controles de banco/custo e o comportamento de rascunho, obter o acesso identificado e validar os fluxos reais antes de deploy. Não considerar este documento uma autorização técnica de lançamento.
