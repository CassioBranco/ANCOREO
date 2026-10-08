# ANCOREO — trabalho compartilhado

Atualização: 12/09/2026. Responsável por esta passagem: Codex.

## Pedido vigente

Cássio solicitou revisão completa da plataforma e do histórico, correções estruturais, reorganização do builder e frontend inspirado na Hostinger. Essa referência substitui a escolha visual anterior. O trabalho completo ainda está em andamento.

## Fonte comum

Usar o mesmo repositório `D:/ancoreo`. Ler [o relatório atualizado](docs/REVISAO-CODEX-2026-09-12-ALTERACOES.md) para alterações, testes e pendências. O diagnóstico inicial está em `docs/REVISAO-CODEX-2026-09-12.md` e descreve a primeira inspeção, anterior às correções.

Os chats não são sincronizados automaticamente. Registrar aqui decisões e resultados relevantes. Não substituir manualmente PAINEL/ESTADO/DIARIO, que são gerados por scripts. Antes de editar, examinar o diff e preservar trabalho de outras sessões.

## Implementado localmente

- Builder com Conteúdo, Estilo e Prévia ampla; score recolhível e adaptação do layout.
- Leitor comum de eventos da geração, com tratamento de erro e interrupção.
- Confirmações de salvamento verificam a resposta do banco; estilo usa fila de gravações.
- Regeneração de sites publicados bloqueada; em rascunhos, preserva depoimentos reais, campos manuais adicionais, ordem e seções bloqueadas. Confirma conclusão depois de salvar.
- Leituras públicas principais filtram site publicado e proprietário; sitemap corrigido para visitante anônimo.
- Erros de marcação JSX corrigidos, preservando o texto mostrado.

Sem commit, deploy ou mutation de dados/policies de produção. O repositório já tinha alterações locais anteriores; não atribuir todo o diff a esta sessão.

## Validação

TypeScript passou. Lint completo terminou com 0 erros e 55 avisos. Passaram os scripts `check-generation-stream.cjs`, `check-public-scope.cjs`, `check-generation-save.cjs` e as quatro checagens existentes de Google Perfil (link, calendário, lembrete e blog→perfil). Testes de persistência usam banco simulado. A conexão do navegador expirou; não há aprovação visual nem end-to-end autenticado.

## Antes de liberar

- Resolver permissões de plano/limite e integridade entre contas no banco, com teste isolado.
- Corrigir quota de IA, reserva atômica e auditoria de publicação.
- Definir rascunho versus conteúdo publicado: o modelo atual grava na mesma página. A regeneração de sites publicados está bloqueada no servidor; para reabilitá-la, implementar versionamento. Revisar também o comportamento dos demais salvamentos.
- Testar concorrência, desfazer, edição direta, salvar/recarregar/publicar em conta de teste.
- Completar identidade visual da landing e demais telas; conferir responsividade e acessibilidade.
- Obter o link do chat principal Cloud/Claude e a identificação da conta Google. A escolha entre três contas foi bloqueada pela revisão automática por falta de indicação explícita. Não contornar isso com sessão alternativa.

## Próximo responsável

Consultar o relatório atualizado, verificar o diff e trabalhar primeiro nas pendências de banco/custo e rascunho. Cada correção deve deixar teste executável proporcional ao risco. Atualizar esta passagem ao terminar. Não tratar as correções locais como lançamento aprovado.
