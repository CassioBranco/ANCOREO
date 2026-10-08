# ANCOREO: revisão técnica e direção visual

Data: 12/09/2026. Status: revisão inicial com verificações em produção; ainda não é aprovação final de lançamento.

## O que foi examinado

- Histórico disponível na conversa “ANCOREO design”: dez interações, incluindo pedidos de ícones próprios, referências navais e simplificação do editor. O retorno do histórico não inclui todas as imagens geradas. A conversa principal mencionada como “Cloud” ainda depende da identificação pelo usuário.
- Código local em `D:/ancoreo`, incluindo arquivos modificados ainda não commitados. Esses arquivos foram preservados.
- Documentos `PAINEL.md`, `ESTADO.md`, `MVP.md`, `RITUAL.md`, `DIARIO.md`, briefing de frontend e documentação de segurança. Seus números antigos não foram tratados como métricas atuais.
- Página pública em https://www.ancoreo.com.br/ e início do login Google.
- Supabase do projeto ANCOREO, ainda chamado HARP.IA no painel: consulta aos Advisors e consultas SELECT aos metadados das políticas e vínculos.
- TypeScript e ESLint executados sobre o código local.

## Parecer

A aplicação tem uma base funcional em Next.js, Supabase e geração de conteúdo por IA. Há autenticação nas rotas críticas e sanitização do HTML de artigos. Porém, a revisão encontrou riscos de isolamento entre contas, controle de custos e coerência comercial que devem ser resolvidos antes de ampliar o uso.

O principal problema de comunicação é misturar preparação para busca com resultado conquistado. A interface precisa distinguir conteúdo otimizado, site publicado, tráfego medido e citação efetivamente observada.

O último painel salvo, de 21/08, registrava 12 de 26 itens prontos. Esse percentual e as contagens antigas do banco não representam o estado verificado em 12/09. A existência de uma chamada no código também não prova que o fluxo funciona de ponta a ponta.

## Prioridades técnicas

| Prioridade | Achado | Evidência e consequência |
|---|---|---|
| Alta | Vínculo entre conteúdo e conta incompleto | `blog_posts`, `pages` e `sections` usam referências independentes para o proprietário e o registro pai. As políticas ativas consultadas validam apenas `tenant_id = auth_tenant_id()`. Constraints consultadas de blog e páginas mostram FK simples, sem vínculo composto entre site e tenant. Pode haver associação cruzada; validar com duas contas em ambiente isolado antes de afirmar exploração reproduzida. |
| Alta | Permissões amplas sobre a própria conta | A política ativa `tenant_self` é ALL e valida o id da conta. A consulta atual `has_column_privilege` retornou **true** para UPDATE de `tenants.plan` e `tenants.sites_allowed` pelo papel authenticated. Plano e limite de sites precisam ser protegidos por coluna ou por operação administrativa. Não foi executada alteração real de plano; eventuais gatilhos adicionais ainda precisam ser avaliados. |
| Alta | Controle de uso da IA incompleto | `app/api/ai/blog/route.ts` chama IA sem quota. `app/api/generate/site/route.ts:64` consulta limite com cliente autenticado e permite seguir se a consulta retornar nulo. O Advisor atual confirma `plan_quotas` com RLS sem políticas, condição incompatível com essa leitura pelo cliente. Não foram feitas chamadas pagas para reproduzir. |
| Alta | Banco recriado pelas migrations pode divergir da produção | A configuração versionada concede permissões globais e não reproduz todo o RLS atualmente ativo. Capturar a configuração efetiva, versioná-la e testar reconstrução limpa. Não é evidência de vazamento atual nas cinco tabelas bloqueadas. |
| Média | Auditoria de publicação pode falhar em silêncio | `app/api/publish/route.ts:115` e `app/api/publish/blog/route.ts:72` inserem em `audit_logs` com cliente de sessão e ignoram erro. A tabela está com RLS sem política no Advisor atual. |
| Média | Publicação não atômica | Site e página são atualizados em operações separadas. Testar falha entre operações e garantir consistência. |
| Média | Verificações não barram build | `next.config.mjs` ignora erros de TypeScript e ESLint durante build. O TypeScript passou nesta revisão, mas o ESLint reprovou. |

RLS ativo não prova que a relação entre dois registros está correta. Uma policy que verifica apenas o dono do artigo não verifica automaticamente o dono do site associado.

## Supabase, verificado nesta sessão

O painel marcou a infraestrutura como Healthy. O Security Advisor retornou **0 erros, 9 avisos e 5 sugestões**. Isso não é uma certificação de segurança.

Os nove avisos são: `search_path` mutável em três funções (`set_blog_posts_updated_at`, `enforce_site_limit`, `match_knowledge`); extensão `vector` em public; execução pública e autenticada das funções SECURITY DEFINER `auth_tenant_id` e `rls_auto_enable`; proteção de senhas vazadas desativada.

As cinco sugestões são RLS habilitado sem policies em `analytics_events`, `audit_logs`, `plan_quotas`, `prompt_templates` e `score_rules`. Esse estado normalmente bloqueia clientes anon/authenticated; não se deve simplesmente liberar essas tabelas para eliminar o aviso. Os consumidores de servidor precisam usar a autorização adequada.

Nenhuma tabela, política, credencial ou registro de cliente foi alterado. As consultas no editor SQL foram somente SELECT sobre metadados. O editor criou um rascunho de consulta durante a leitura.

## Produto e comunicação

1. **Promessa de citação sem evidência visível.** A landing diz que o negócio aparece na resposta da IA e mostra um exemplo com nomes de plataformas. Identificar como ilustração ou substituir por explicação do que a ferramenta prepara; uma simulação não deve parecer prova de resultado.
2. **Gráfico com números fixos.** `GROWTH` em `app/page.tsx` contém 120 a 3.400 visitas. Há a indicação “site de exemplo”, mas o texto sugere crescimento automático. Remover a expectativa numérica ou usar um caso real com período, fonte e contexto.
3. **Planos conflitantes.** A landing vende Starter/Pro/Agency, enquanto documentos posteriores registram beta gratuito e revisão dos planos. A decisão comercial vigente precisa ser única antes de reescrever preços.
4. **Automação do blog descrita de forma ampla.** A FAQ sugere publicação automática, enquanto o fluxo e o MVP usam revisão/publicação pelo usuário. Descrever com precisão o que é gerado e o que precisa de aprovação.
5. **Mensagem incorreta sobre Google Perfil.** O banner em `app/(dashboard)/layout.tsx` afirma que o site não aparece na busca sem conectar o perfil. Conectar o Perfil de Empresa não é requisito geral de indexação de páginas. Substituir por benefício de presença local. Os requisitos técnicos oficiais tratam de acesso do Googlebot, resposta HTTP válida e conteúdo indexável: [Google Search Central](https://developers.google.com/search/docs/essentials/technical).
6. **Estado vazio e erro confundidos.** A lista de sites transforma retorno de consulta sem dados em lista vazia sem examinar o erro. O usuário pode receber “crie seu primeiro site” quando houve falha de leitura. Separar erro, carregamento e ausência real de sites.
7. **Contexto de vários sites.** A tela de métricas escolhe o site mais recente. A nova interface deve tornar o site ativo explícito e manter a seleção entre métricas, blog e editor.

## Visual e experiência

A página pública observada combina título serifado, Google multicolorido, selo, botões com sombra rígida e várias etiquetas flutuantes sobre a prévia. Há identidade, mas muitos elementos disputam atenção e as etiquetas comprimem a demonstração do produto.

O código do painel usa superfícies de vidro e fundo animado, enquanto a landing é editorial. A transição deve manter tipografia, cores, botões e estados comuns. A avaliação visual do painel autenticado ainda está pendente do login autorizado.

Mudanças propostas:

- Apresentar o benefício em linguagem simples antes das siglas.
- Usar uma demonstração grande do produto e reduzir adereços flutuantes.
- Trocar miniaturas de gradiente por prévias dos modelos reais.
- Navegação principal: Visão geral, Meu site, Blog, Google Perfil e Resultados; agrupar funções secundárias conforme uso real.
- No editor: páginas e seções à esquerda, prévia ao centro, propriedades contextuais à direita; indicar “salvando”, “salvo” e erro de salvamento.
- Separar “Salvar rascunho”, “Visualizar” e “Publicar”, com efeito claro de cada ação.
- Usar ícones consistentes e rotulados. Reservar a metáfora naval para marca e ilustrações, sem obrigar o cliente a decifrar nomes de ferramentas.
- Validar teclado, foco, contraste, toque e comportamento em celular na implementação.

## Três direções de identidade

| Direção | Paleta | Tipografia | Composição e aplicação |
|---|---|---|---|
| **Porto, recomendada** | Petróleo #123E3A, marfim #F5F3EC, verde #216B5A, tinta #172D2B | Manrope; títulos com peso forte, corpo confortável | Superfícies claras, bastante espaço, marca compacta com âncora geométrica. Boa leitura para pequenos empresários; mesma base na landing e no painel. |
| **Carta Náutica** | Azul #112D46, areia #F2EADB, ferrugem #A9412B | Fraunces + Plus Jakarta Sans | Layout editorial assimétrico, linhas finas e referências de cartografia. Preserva mais da personalidade histórica e dá protagonismo à demonstração do site. |
| **Farol** | Noite #101B28, branco #F6F8FA, laranja #F39A52 | Sora + Source Sans 3 | Hero escuro, contraste forte, tipografia grande e painel operacional claro. Personalidade tecnológica com maior impacto visual. |

As três são propostas, ainda não implementadas. A escolha está pendente. Cores precisam passar pela verificação de contraste em cada combinação de uso; a paleta por si só não certifica acessibilidade.

## Resultado dos testes

- TypeScript: passou, `tsc --noEmit --incremental false`, saída 0.
- ESLint: reprovou, saída 1. Erros de aspas não escapadas em `SectionEditor.tsx:290`, `onboarding/page.tsx:1488` e `SiteTemplate.tsx:214`; avisos de dependências de hooks e uso de imagens. Uso de `<img>` é decisão do projeto, portanto o aviso isolado não comprova problema de performance.
- A primeira execução do lint tentou gravar cache fora da pasta permitida. A execução sem cache foi concluída e gerou os achados acima.
- Build de produção e Lighthouse não executados; não há nota de performance verificada.
- Não foram exercitados fluxos de geração, publicação, recuperação de senha, envio de e-mail ou pagamento.

## O que falta para concluir o pedido

1. Identificar a conversa/projeto principal mencionado como “Cloud”. O histórico de design encontrado não substitui esse chat.
2. Confirmar qual conta Google usar no login do ANCOREO. A seleção foi bloqueada pela revisão automática por haver três contas e nenhuma indicação explícita.
3. Escolher a direção visual. A skill de landing pages pede três opções antes do desenvolvimento; elas estão acima, com recomendação.
4. Exercitar os cinco fluxos com conta de teste, validar riscos de isolamento sem tocar dados de clientes e implementar as correções necessárias.
5. Aplicar a identidade escolhida, conferir desktop/celular/tema escuro e entregar a alteração revisável antes da publicação.

Nenhuma alteração visual ou deploy foi feita nesta etapa.
