# 📘 MASTER HANDOFF DOCUMENT & LOG DE INTERAÇÕES — PROJETO BOOKHUB / GAMEHUB

> **DOCUMENTO EXCLUSIVO PARA O MODELO DE IA (ANTIGRAVITY / GEMINI / LLM)**  
> **Destinatário:** A próxima instância de IA que atender o usuário Pedro Henrique neste repositório.  
> **Instrução Primária:** Leia este documento integralmente antes de emitir qualquer resposta. Ele foi intencionalmente redigido com **extrema verbosidade, riqueza técnica e profundidade de detalhes**, servindo como memória externa completa para a continuidade do projeto. Não economize em contexto técnico nas suas análises internas.

---

## 1. PERFIL DO USUÁRIO & ESPECIFICAÇÃO OFICIAL DO TRIMESTRE

* **Usuário:** Pedro Henrique.
* **Nome do Projeto no Repositório:** **Bookhub** (Acervo Oficial: **JOGOS** — plataforma temática de locação e rede social de games).
* **Natureza do Projeto:** Projeto avaliado do trimestre acadêmico (Trilha Intermediária da disciplina).
* **Conceito Central:** Biblioteca digital para **aluguel, controle de estoque e avaliação de JOGOS**, com busca externa na API da RAWG, ficha técnica persistida em banco relacional local, autenticação de usuários em dois papéis (`leitor` e `admin`), motor de cálculo de juros por atraso de devolução e camada social com notas de 1 a 5 estrelas e coleção/backlog pessoal.

---

### 📋 REGRAS E DIRETRIZES OFICIAIS DO TRIMESTRE (ENUNCIADO DA BANCA EXAMINADORA):

1. **O Acervo & As Obras (JOGOS):**
   - O entregável formal é uma biblioteca digital. No `README.md`, o aluno declara o acervo escolhido. O Pedro escolheu oficialmente **JOGOS**.
   - O desenho arquitetural não muda conforme o acervo. A entidade central do acervo chama-se obrigatoriamente **`obras`**.
   - As rotas da API são padronizadas pela banca: `GET /obras` e `POST /emprestimos`.
   - Se o acervo fosse misto, haveria a coluna `tipo` (`livro`, `filme`, `jogo`). Como o acervo do Pedro é dedicado a jogos, a obra representa o jogo diretamente.

2. **Integração com API Externa (RAWG Video Games Database API):**
   - Fluxo de dados: O frontend nunca cadastra itens diretamente no vácuo; a página chama a API local do Node.js. A API local consulta a **Search API da RAWG** (`https://api.rawg.io/api/games?key=...`).
   - A chave de API gratuita da RAWG deve ser armazenada estritamente na variável de ambiente do arquivo `.env` (que jamais pode ser comitada no Git).
   - Ao encontrar o jogo, a API grava a ficha no banco de dados local com o campo `id_externo` (ID único do RAWG, ex: `3498` para GTA V) e apenas depois disso permite operações de estoque, aluguel e avaliações.
   - **Regra de Validação de Ficha:** `titulo` vazio impede a criação do cadastro. Por outro lado, a ausência de estúdio/desenvolvedora ou ano de lançamento **não impede a ficha** (podem ser nulos). A API externa jamais substitui o banco local: uma vez gravada a ficha, as consultas internas dependem do MySQL.

3. **Categorias (Requisito Formal da Trilha Intermediária):**
   - Categoria é modelada obrigatoriamente como tabela independente (**`categorias`**), e nunca como texto solto ou enum na tabela de obras.
   - A obra referencia a categoria através da Chave Estrangeira **`obras.categoria_id`**.
   - **Regra de Integridade Referencial:** Apagar uma categoria que ainda tenha qualquer obra atrelada deve disparar um erro de violação de chave estrangeira (`ON DELETE RESTRICT`) que a API deve capturar e tratar amigavelmente.

4. **Regras de Negócio de Estoque, Aluguel e Devolução:**
   - **Disponibilidade para Locação:** Somente obras com `quantidade_disponivel > 0` podem ser alugadas.
   - **Operação de Empréstimo:** Emprestar um exemplar subtrai imediatamente 1 unidade do estoque (`quantidade_disponivel - 1`).
   - **Tratamento de Estoque Esgotado:** Caso um usuário tente alugar uma obra com `quantidade_disponivel == 0`, a API deve responder obrigatoriamente com código HTTP **`400 Bad Request`**.
   - **Operação de Devolução:** Devolver o exemplar devolve 1 unidade ao estoque (`quantidade_disponivel + 1`).
   - **Preços e Valores:** O `valor_aluguel` é gravado no registro histórico do empréstimo no momento da locação. O `valor_compra` fica registrado apenas no cadastro da obra como valor referencial patrimonial da biblioteca.
   - **Motor de Juros e Multa por Atraso:**
     - Quando a data atual ultrapassar a `data_prevista` sem que haja `data_devolucao` preenchida, o status do empréstimo passa a ser considerado **`atrasado`**.
     - A taxa de juros diária é de **1% do valor do aluguel por dia de atraso**.
     - O cálculo é de **juros simples** (sem juros sobre juros / sem capitalização composta). Fórmula: `valor_multa = valor_aluguel * 0.01 * dias_atraso`.

5. **Status do Empréstimo & Papéis de Usuário (Trilha Intermediária):**
   - O domínio de negócio prevê três perfis de referência: **Usuário (Leitor/Jogador)**, **Gestor** e **Admin**.
   - Na implementação avaliada (trilha intermediária), existem dois papéis formais autenticados: **`leitor`** (usuário padrão que consulta, aluga, devolve e avalia) e **`admin`** (que absorve a gestão de estoque, disponibilidade, categorias e usuários).
   - Segurança: Senhas obrigatoriamente armazenadas com hash criptográfico (`senha_hash` com `bcryptjs`) e autenticação baseada em tokens JWT / sessões.

---

## 2. DIRETRIZES PEDAGÓGICAS E REGRAS OPERACIONAIS PARA QUALQUER IA

> 🚨 **REGRAS DE OURO INEGOCIÁVEIS (LEIA ANTES DE CADA RESPOSTA):**  
> 
> 1. **MÉTODO SOCRÁTICO E TUTORIA PASSO A PASSO:**  
>    **JAMAIS gere scripts SQL completos prontos para o Pedro apenas copiar e colar, e JAMAIS crie tabelas por ele.**  
>    O Pedro precisa entender, justificar e defender cada decisão técnica perante a banca examinadora da faculdade. Seu papel é explicar os conceitos teóricos de banco de dados, propor perguntas reflexivas sobre os tipos e restrições, e guiá-lo clique a clique na interface visual do **phpMyAdmin hospedado no Easypanel**.  
> 
> 2. **PADRONIZAÇÃO TOTAL EM PORTUGUÊS:**  
>    Para atender ao gabarito formal da banca e demonstrar maturidade de código, é estritamente proibido misturar idiomas (*Portinglês*). Todas as tabelas, colunas, enums e rotas locais devem ser nomeadas em português claro e coerente (`usuarios`, `obras`, `categorias`, `emprestimos`, `avaliacoes`, `estante_usuario`).  
> 
> 3. **ATUALIZAÇÃO OBRIGATÓRIA E CONTÍNUA DO DIÁRIO (MENSAGEM A MENSAGEM):**  
>    A cada nova mensagem que o Pedro enviar e a cada resposta gerada pela IA, **é dever obrigatório da IA atualizar o arquivo `handoff.md`** adicionando o registro detalhado do turno na Seção 6 (`LOG CRONOLÓGICO DE TODAS AS MENSAGENS`), mantendo este documento permanentemente sincronizado para os commits do Git.  
> 
> 4. **AUTORIZAÇÃO DE HIPER-VERBOSIDADE TÉCNICA:**  
>    O Pedro autorizou expressamente que este documento seja **extensamente descritivo, técnico e minucioso**. Este arquivo não precisa ser resumido; ele serve como banco de memória definitivo para o modelo de inteligência artificial.

---

## 3. MODELAGEM RELACIONAL COMPLETA E DETALHAMENTO DE TIPOS

Abaixo está o esquema relacional completo do banco de dados `bookhub_db`, modelado na Terceira Forma Normal (3FN), com integridade referencial rigorosa:

```
+---------------------------------------------------------------------------------------------------+
|                                      ESQUEMA RELACIONAL COMPLETO                                  |
+---------------------------------------------------------------------------------------------------+

 [usuarios] (Tabela Independente - Autenticação e Perfis)
   ├── id (INT, PK, AUTO_INCREMENT) -> Identificador numérico do usuário
   ├── nome (VARCHAR 100, NOT NULL) -> Nome civil ou apelido de exibição
   ├── email (VARCHAR 255, NOT NULL, UNIQUE) -> Chave de login única no sistema
   ├── senha_hash (VARCHAR 255, NOT NULL) -> Hash gerado pelo bcrypt (tamanho fixo de 60 chars em base255)
   ├── papel (ENUM 'leitor', 'admin', NOT NULL, DEFAULT 'leitor') -> Controle de acesso da trilha intermediária
   ├── avatar_url (VARCHAR 255, NULL) -> Link do avatar hospedado no Cloudinary (opcional no cadastro)
   └── criado_em (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP) -> Timestamp automático de auditoria

 [categorias] (Tabela Independente - Gêneros de Games)
   ├── id (INT, PK, AUTO_INCREMENT) -> Identificador numérico da categoria
   └── nome (VARCHAR 100, NOT NULL, UNIQUE) -> Nome do gênero (ex: RPG, Ação, Plataforma, Roguelike)

 [obras] (Catálogo Central de Jogos - Ficha Oficial de Acervo)
   ├── id (INT, PK, AUTO_INCREMENT) -> Identificador interno único da obra
   ├── id_externo (VARCHAR 100, NULL) -> Identificador vindo da RAWG API (para sincronização)
   ├── titulo (VARCHAR 255, NOT NULL) -> Título do jogo (validação: obrigatório)
   ├── estudio (VARCHAR 150, NULL) -> Desenvolvedora/Publicadora (opcional conforme enunciado)
   ├── ano (SMALLINT, NULL) -> Ano de lançamento (SMALLINT gasta 2 bytes; opcional conforme enunciado)
   ├── categoria_id (INT, NOT NULL, FK -> categorias.id, ON DELETE RESTRICT) -> Gênero obrigatório
   ├── quantidade_disponivel (INT, NOT NULL, DEFAULT 0) -> Exemplares físicos/digitais em estoque
   ├── valor_aluguel (DECIMAL 10,2, NOT NULL, DEFAULT 0.00) -> Preço base da diária/semana de locação
   ├── valor_compra (DECIMAL 10,2, NULL) -> Preço de referência contábil do item
   ├── sinopse (TEXT, NULL) -> Descrição completa e enredo do jogo
   ├── capa_url (VARCHAR 255, NULL) -> URL da imagem de capa fornecida pela RAWG
   └── criado_em (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP) -> Registro de inserção no acervo

 [emprestimos] (Mecanismo de Locação, Estoque e Juros por Atraso)
   ├── id (INT, PK, AUTO_INCREMENT) -> Identificador único da transação de locação
   ├── usuario_id (INT, NOT NULL, FK -> usuarios.id, ON DELETE RESTRICT) -> Leitor que alugou
   ├── obra_id (INT, NOT NULL, FK -> obras.id, ON DELETE RESTRICT) -> Jogo alugado
   ├── data_emprestimo (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP) -> Horário da locação
   ├── data_prevista (DATETIME, NOT NULL) -> Data/hora acordada para devolução
   ├── data_devolucao (DATETIME, NULL) -> Preenchido apenas quando o jogo é devolvido (NULL = pendente)
   ├── valor_aluguel (DECIMAL 10,2, NOT NULL) -> Registro imutável do valor cobrado no aluguel
   ├── valor_multa (DECIMAL 10,2, NOT NULL, DEFAULT 0.00) -> Valor calculado de juros simples por atraso
   └── status (ENUM 'emprestado', 'devolvido', 'atrasado', NOT NULL, DEFAULT 'emprestado')

 [avaliacoes] (Camada Social - Notas de 1 a 5 e Críticas Textuais)
   ├── id (INT, PK, AUTO_INCREMENT) -> Identificador da avaliação
   ├── usuario_id (INT, NOT NULL, FK -> usuarios.id, ON DELETE CASCADE) -> Autor da avaliação
   ├── obra_id (INT, NOT NULL, FK -> obras.id, ON DELETE CASCADE) -> Jogo avaliado
   ├── nota (TINYINT, NOT NULL) -> Avaliação de 1 a 5 estrelas (TINYINT ocupa apenas 1 byte)
   ├── resenha (TEXT, NULL) -> Crítica escrita opcional (permite avaliar apenas com estrelas)
   ├── criado_em (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP) -> Data de publicação
   └── UNIQUE KEY (usuario_id, obra_id) -> Restrição Composta: impede múltiplas reviews do mesmo usuário

 [estante_usuario] (Coleção Pessoal, Backlog e Registro de Progresso)
   ├── id (INT, PK, AUTO_INCREMENT) -> Identificador do registro na coleção
   ├── usuario_id (INT, NOT NULL, FK -> usuarios.id, ON DELETE CASCADE) -> Dono da coleção
   ├── obra_id (INT, NOT NULL, FK -> obras.id, ON DELETE CASCADE) -> Jogo na estante
   ├── status_jogo (ENUM 'quero_jogar', 'jogando', 'zerado', 'abandonado', NOT NULL, DEFAULT 'quero_jogar')
   ├── horas_jogadas (INT, NULL) -> Horas registradas (NULL para itens de wishlist)
   ├── atualizado_em (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
   └── UNIQUE KEY (usuario_id, obra_id) -> Restrição Composta: jogo único por usuário no backlog
```

---

### 🔍 JUSTIFICATIVAS TÉCNICAS E ACADÊMICAS DAS ESCOLHAS:

1. **Por que `DECIMAL(10,2)` em vez de `FLOAT` ou `DOUBLE`?**  
   Os tipos `FLOAT` e `DOUBLE` utilizam representação binária aproximada de ponto flutuante conforme o padrão IEEE 754. Em sistemas financeiros ou de locação, operações de soma e subtração geram imprecisões e dízimas acumuladas de centavos. O `DECIMAL(10,2)` utiliza ponto fixo com armazenamento exato em base decimal, sendo o único aceito em auditorias acadêmicas e profissionais.

2. **Por que `TINYINT` para a coluna `nota`?**  
   O tipo `INT` comum consome 4 bytes de memória (capacidade de até 2.147.483.647). Como a regra de notas da plataforma varia estritamente de 1 a 5 estrelas, o uso de `TINYINT` (que gasta apenas 1 byte, com capacidade de -128 a 127) otimiza brutalmente o armazenamento em disco e o cache de índices no buffer pool do InnoDB quando a tabela atingir milhares de avaliações.

3. **Por que `ON DELETE RESTRICT` em `emprestimos` e `ON DELETE CASCADE` em `avaliacoes`?**  
   - Na tabela `emprestimos`, temos um histórico financeiro e fiscal. Apagar um usuário ou um jogo que possui registros de empréstimos destruiria a integridade do caixa da biblioteca. Portanto, o `RESTRICT` impede que o administrador exclua acidentalmente registros com vínculos ativos.
   - Na tabela `avaliacoes` e `estante_usuario`, trata-se de conteúdo social dependente do perfil. Se o usuário solicitar exclusão da conta (em conformidade com a LGPD), os dados devem ser limpos em cascata (`CASCADE`) para não deixar reviews órfãs de autores inexistentes no banco.

4. **Por que Chaves Únicas Compostas `UNIQUE(usuario_id, obra_id)`?**  
   Sem essa restrição no banco, o frontend ou a API precisariam fazer consultas adicionais com `SELECT` antes de cada `INSERT` para verificar se o usuário já avaliou o jogo, gerando condições de corrida (*race conditions*). A restrição composta ao nível do banco de dados assegura idempotência e consistência absoluta diretamente no motor do MySQL.

---

## 4. STATUS ATUAL DO BANCO DE DADOS NO PHPMYADMIN

| # | Tabela | Status | Configurações Concluídas |
| :---: | :--- | :---: | :--- |
| **1** | **`usuarios`** | ✅ Concluída | `id` (PK, AI), `nome`, `email` (`UNIQUE`), `senha_hash`, `papel` (`ENUM('leitor','admin')`), `avatar_url`, `criado_em`. |
| **2** | **`categorias`** | ✅ Concluída | `id` (PK, AI), `nome` (`UNIQUE`). |
| **3** | **`obras`** | ✅ Concluída | `id` (PK, AI), `id_externo`, `titulo`, `estudio`, `ano`, `categoria_id` (FK `RESTRICT`), `quantidade_disponivel`, `valor_aluguel`, `valor_compra`, `sinopse`, `capa_url`. |
| **4** | **`emprestimos`** | ✅ Concluída | `id` (PK, AI), `usuario_id` (FK `RESTRICT`), `obra_id` (FK `RESTRICT`), `data_emprestimo`, `data_prevista`, `data_devolucao`, `valor_aluguel`, `valor_multa`, `status` (`ENUM`). |
| **5** | **`avaliacoes`** | ✅ Concluída | `id` (PK, AI), `usuario_id` (FK `CASCADE`), `obra_id` (FK `CASCADE`), `nota` (`TINYINT`), `resenha` (`TEXT`), `criado_em`, `UNIQUE(usuario_id, obra_id)`. |
| **6** | **`estante_usuario`** | ⏳ **PENDENTE** | Definição completa pronta; aguardando criação física no phpMyAdmin pelo Pedro. |

---

## 5. PENDÊNCIA EXATA PARA RETOMADA (PRÓXIMO PASSO IMEDIATO)

Ao reabrir a conversa em qualquer dispositivo, a IA deve acolher o Pedro e direcioná-lo imediatamente para a criação da **última tabela pendente**:

### 📌 **Criação da Tabela `estante_usuario` no phpMyAdmin**

1. No menu do banco `bookhub_db`, criar tabela **`estante_usuario`** com **`6 colunas`**:
   - **`id`**: `INT`, Índice `PRIMARY`, marcar `A_I` (Auto Increment).
   - **`usuario_id`**: `INT`, Índice `INDEX`, `Null` desmarcado.
   - **`obra_id`**: `INT`, Índice `INDEX`, `Null` desmarcado.
   - **`status_jogo`**: `ENUM('quero_jogar','jogando','zerado','abandonado')`, `Null` desmarcado, Padrão: `'quero_jogar'`.
   - **`horas_jogadas`**: `INT`, **marcar a caixinha `Null`** (opcional para jogos na wishlist).
   - **`atualizado_em`**: `TIMESTAMP`, Padrão: `CURRENT_TIMESTAMP`, Atributos: `on update CURRENT_TIMESTAMP`.
2. Storage Engine: **`InnoDB`** -> Clicar em **"Save" (Salvar)**.
3. **Restrição Única Composta:** Na aba *Structure*, marcar os checkboxes de `usuario_id` e `obra_id` e clicar no botão **"Unique"** embaixo da lista de colunas.
4. **Foreign Keys (*Relation view*):**
   - `usuario_id` -> `usuarios.id` com **`ON DELETE CASCADE`**.
   - `obra_id` -> `obras.id` com **`ON DELETE CASCADE`**.
   - Clicar em **"Save"**.

---

## 6. LOG CRONOLÓGICO COMPLETO DE TODAS AS MENSAGENS (DIÁRIO DE BORDO)

Abaixo está o registro histórico integral, turno por turno, documentando as mensagens trocadas entre o usuário Pedro Henrique e o Assistente IA:

---

### [2026-10-08 14:36] — Interação 1: Pesquisa de APIs de Livros
* **Usuário:** Perguntou se existiam APIs públicas e gratuitas para livros.
* **Assistente:** Apresentou a Open Library Search API, a Google Books API e o Projeto Gutenberg, explicando vantagens de cada uma.

---

### [2026-10-08 14:42] — Interação 2: Definição da Proposta Acadêmica
* **Usuário:** Apresentou a ideia do projeto (site de avaliação de livros com resenhas e notas, estilo Goodreads/Skoob, para avaliação de faculdade) e perguntou quais features copiar.
* **Assistente:** Mapeou as features essenciais: catálogo de livros/autores, estante do leitor com status (Lendo, Lido, Quero Ler), resenhas com notas de 1 a 5, comentários e perfil.

---

### [2026-10-08 14:54] — Interação 3: Estrutura do Banco de Dados
* **Usuário:** Pediu orientação sobre como preparar o banco de dados de forma bem estruturada antes de mexer em código.
* **Assistente:** Explicou as Formas Normais (1FN, 2FN, 3FN), Chaves Primárias, Chaves Estrangeiras e restrições de integridade.

---

### [2026-10-08 15:12] — Interação 4: Metodologia Passo a Passo & phpMyAdmin
* **Usuário:** *"Prefiro incluir essas features que lembram rede social para leitores. No entanto, gostaria de começar estruturando o banco, mas não quero que você faça pra mim. Gostaria que você fosse me ensinando passo a passo as etapas iniciais. Tenha em mente que estou usando o phpMyAdmin no Easypanel."*
* **Assistente:** Concordou com a postura pedagógica. Ensinou o **Passo 1 (Criar database `bookhub_db` com collation `utf8mb4_unicode_ci`)** e propôs as 3 primeiras perguntas reflexivas para a tabela `users`.

---

### [2026-10-08 15:23] — Interação 5: Limpeza do Template Base "Aura8"
* **Usuário:** *"Pode remover tudo que for referente ao aura8 desse projeto? Gostaria de usar a base dele como modelo..."*
* **Assistente:** Fez varredura completa no projeto. Limpou referências ao Aura8 em `Dockerfile`, `docker-compose.yml`, `Header.js`, `Header.module.css`, e substituiu a landing page antiga por uma página base do Bookhub em `pages/index.js`. Limpou o cache `.next` e encerrou processos legados.

---

### [2026-10-08 15:38] — Interação 6: Consulta de Acesso à Conversa Anterior
* **Usuário:** Perguntou se a IA tinha acesso ao histórico da conversa sobre o site de avaliação de livros.
* **Assistente:** Confirmou o acesso ao histórico anterior e resumiu o ponto exato onde a conversa havia parado (Passo 2 - Tabela `users`).

---

### [2026-10-08 15:43] — Interação 7: Repetição do Passo 1
* **Usuário:** Pediu para repetir o Passo 1 nesta conversa.
* **Assistente:** Detalhou o Passo 1: criação do banco `bookhub_db` no phpMyAdmin e seleção do agrupamento `utf8mb4_unicode_ci` (explicando suporte a emojis e caracteres internacionais).

---

### [2026-10-08 15:45] — Interação 8: Verificação de Resquícios do Aura8 no Frontend
* **Usuário:** *"Antes de continuarmos, removeu realmente tudo referente ao Aura8 do projeto? Ainda estou vendo, por exemplo, a página do aura8 no frontend."*
* **Assistente:** Investigou a fundo e descobriu que o processo Node antigo (PID 14488) ainda estava rodando na porta 3000 executando o cache antigo `.next`. Encerrou o processo, apagou `.next`, atualizou `_app.js` e `utils/auth.js`. Varredura confirmou zero ocorrências de termos do Aura8.

---

### [2026-10-08 15:54 a 16:04] — Interação 9: Criação do Documento Handoff
* **Usuário:** Pediu para criar um arquivo `.md` na raiz com o contexto completo para poder continuar em casa, sendo extremamente verboso.
* **Assistente:** Criou o arquivo `handoff.md` com arquitetura, diretrizes, histórico e o roadmap de tabelas.

---

### [2026-10-09 08:34] — Interação 10: Criação da Tabela `users`
* **Usuário:** Perguntou se podiam seguir para a criação da tabela `users`.
* **Assistente:** Guiou campo por campo no phpMyAdmin as 6 colunas de `users` (`id`, `full_name`, `email` UNIQUE, `password_hash`, `avatar_url` NULL, `created_at`).

---

### [2026-10-09 09:36] — Interação 11: Criação da Tabela `authors`
* **Usuário:** Informou que a tabela `users` foi criada e pediu o próximo passo.
* **Assistente:** Explicou por que não criar `books` ainda (dependência de chave estrangeira) e propôs a tabela `authors` com perguntas sobre `TEXT` vs `VARCHAR` para a biografia e nulabilidade da foto.

---

### [2026-10-09 12:05] — Interação 12: Respostas do Usuário sobre `authors`
* **Usuário:** Respondeu que `TEXT` é ideal para a biografia por ser um parágrafo longo, e que `photo_url` pode ser `Null` para autores ocultos/sem foto. E elogiou o formato de perguntas.
* **Assistente:** Elogiou as respostas e guiou a configuração de `authors` no phpMyAdmin (`id`, `name`, `bio`, `photo_url`).

---

### [2026-10-09 13:09] — Interação 13: Conclusão de `authors` e Proposta de `genres`
* **Usuário:** Informou que `authors` estava pronto e pediu o próximo passo.
* **Assistente:** Apresentou a tabela `genres` (gêneros), explicando o conceito de `slug` para URLs amigáveis e fazendo perguntas sobre unicidade do nome do gênero.

---

### [2026-10-13 11:53] — Interação 14: Entrada da Especificação Oficial do Trimestre
* **Usuário:** Trouxe o briefing formal do trimestre:
  - Acervo selecionado no README (livros, filmes, jogos ou os três).
  - Tabela oficial de ficha: **`obras`** (com rotas `GET /obras` e `POST /emprestimos`).
  - API externa: Open Library para livros, RAWG para jogos, TMDB para filmes.
  - Categoria como tabela (**`categorias`**) com chave `obras.categoria_id` (erro de chave ao apagar categoria com obras vinculadas).
  - Controle de estoque (`quantidade_disponivel`), aluguel (`valor_aluguel`), devolução, status (`emprestado`, `devolvido`, `atrasado`) e juros de 1% ao dia sem juros compostos.
  - Papéis da trilha intermediária: **`leitor`** e **`admin`** com hash e sessões.
* **Assistente:** Alinhou a modelagem com as regras da banca, sem perder o que já havia sido feito.

---

### [2026-10-13 12:07] — Interação 15: Padronização para Português & Cargos
* **Usuário:** Pontuou que as tabelas e colunas deveriam ser em português para seguir o padrão oficial, e esclareceu a relação entre os papéis (Usuário = leitor no ciclo, Gestor = referência, Admin = admin no ciclo).
* **Assistente:** Elogiou a decisão. Instruiu a recriação da tabela para o padrão em português: **`usuarios`** com as colunas `id`, `nome`, `email`, `senha_hash`, `papel` (`'leitor','admin'`), `avatar_url` e `criado_em`.

---

### [2026-10-13 12:17] — Interação 16: Confirmação de Salvamento no Handoff
* **Usuário:** Perguntou se tudo estava sendo salvo no Handoff.
* **Assistente:** Confirmou e atualizou o documento com o briefing completo e o novo esquema relacional em português.

---

### [2026-10-13 12:36] — Interação 17: Ajuste de `usuarios` Concluído & Tabela `categorias`
* **Usuário:** Informou que ajustou a tabela `usuarios` e pediu a próxima.
* **Assistente:** Iniciou a tabela **`categorias`** com 2 colunas (`id` e `nome`), perguntando sobre tamanho e o índice `UNIQUE`.

---

### [2026-10-13 12:47] — Interação 18: Resposta de `categorias` & Proposta de `obras`
* **Usuário:** Respondeu que colocou `id` como INT auto increment e `nome` como VARCHAR(100) UNIQUE, pois não faz sentido ter duas categorias repetidas.
* **Assistente:** Validou e introduziu a tabela central **`obras`** com 11 colunas, fazendo 3 perguntas reflexivas (DECIMAL para valores monetários, nulabilidade de `titulo`/`autor`/`ano`, e tipo da FK `categoria_id`).

---

### [2026-10-13 13:18] — Interação 19: Respostas sobre `obras` & Esclarecimento do Acervo
* **Usuário:** Respondeu sobre o uso de DECIMAL para precisão de centavos, nulabilidade e tipo INT da FK. Pediu descrição detalhada de cada coluna no phpMyAdmin e perguntou se a IA estava ciente de que o projeto era apenas sobre livros (já que mencionou filmes/músicas).
* **Assistente:** Esclareceu categoricamente que o projeto é 100% sobre livros (a menção foi apenas citação do texto geral do professor). Passou o guia detalhado campo por campo das 11 colunas de `obras`.

---

### [2026-10-13 13:38] — Interação 20: Tabela `obras` Salva & Foreign Key RESTRICT
* **Usuário:** Informou que a tabela `obras` estava pronta.
* **Assistente:** Guiou a criação da Chave Estrangeira `categoria_id -> categorias.id` com `ON DELETE RESTRICT` na *Relation view* e introduziu a tabela **`emprestimos`** com perguntas sobre ENUM para o status, nulabilidade da devolução e formato de datas.

---

### [2026-10-14 11:01] — Interação 21: PIVOT DE ACERVO — Mudança de Livros para JOGOS
* **Usuário:** *"Gostaria de mudar a minha ideia de aluguéis de livros para aluguéis de jogos. Podemos mudar as tabelas?"*
* **Assistente:** Apoiou totalmente, mostrando que o enunciado permitia escolher jogos. Explicou que o impacto era mínimo: na tabela `obras`, apenas renomear a coluna `autor` para `estudio`. A API externa passa a ser a **RAWG API** (`https://api.rawg.io/api/games`).

---

### [2026-10-14 11:04] — Interação 22: Criação da Tabela `emprestimos` para Jogos
* **Usuário:** Pediu para criar a tabela `emprestimos`.
* **Assistente:** Passou o descritivo exato das 9 colunas de `emprestimos` no phpMyAdmin (`id`, `usuario_id`, `obra_id`, `data_emprestimo`, `data_prevista`, `data_devolucao` NULL, `valor_aluguel`, `valor_multa`, `status` ENUM).

---

### [2026-10-14 14:22] — Interação 23: Tabela `emprestimos` Salva & Proposta de `avaliacoes`
* **Usuário:** Confirmou a criação de `emprestimos`.
* **Assistente:** Instruiu a amarração das Chaves Estrangeiras de `usuario_id` e `obra_id` em `emprestimos` com `ON DELETE RESTRICT`. Em seguida, introduziu a tabela social **`avaliacoes`** (reviews e notas de 1 a 5 estrelas dos jogos), fazendo 3 perguntas reflexivas (TINYINT para notas, resenha com Null e restrição de 1 review por jogo).

---

### [2026-10-15 10:26] — Interação 24: Respostas sobre `avaliacoes`
* **Usuário:** Respondeu que TINYINT faz mais sentido, que o usuário só deve poder fazer uma review por jogo (mas não sabia como fazer no MySQL), e que deve poder avaliar sem escrever review.
* **Assistente:** Elogiou as respostas. Ensinou o conceito de **Chave Única Composta (`UNIQUE(usuario_id, obra_id)`)** e guiou o preenchimento no phpMyAdmin.

---

### [2026-10-15 14:56] — Interação 25: `avaliacoes` Concluída & Proposta de `estante_usuario`
* **Usuário:** Confirmou a criação de `avaliacoes` com a restrição única.
* **Assistente:** Instruiu a ligação das FKs com `ON DELETE CASCADE` (explicando a diferença para o `RESTRICT`). Em seguida, apresentou a tabela **`estante_usuario`** (backlog de jogos), perguntando sobre o tipo para os 4 estados do jogo e como tratar as horas jogadas na wishlist.

---

### [2026-10-15 15:34] — Interação 26: Resposta sobre `estante_usuario`
* **Usuário:** *"Simples, a gente só colocaria como possivelmente null, assim um jogo que está como 'desejado' (na wishlist) ele não exige horas registradas e na parte do status_jogo a gente colocaria como enum."*
* **Assistente:** Validou a solução excelente e forneceu o guia detalhado das 6 colunas para configurar no phpMyAdmin.

---

### [2026-10-15 15:35 a 15:37] — Interação 27 & 28: Registro Completo de Mensagens Solicitado
* **Usuário:** Pediu para salvar tudo no handoff para poder commitar, e pontuou que queria ver o log mensagem a mensagem registrado no arquivo.
* **Assistente:** Atualizou o `handoff.md` com o log cronológico integral de todas as interações e decisões, garantindo rastreabilidade absoluta para qualquer IA ou leitor futuro.

---

### [2026-10-15 15:39] — Interação 29: Regra Obrigatória de Atualização Contínua do Diário
* **Usuário:** *"Quero deixar claro de que daqui pra frente eu quero que você armazene todas as nossas mensagens dessa maneira para que caso eu continue o projeto em casa, a IA possa analisar o que foi dito e continuar exatamente de onde paramos."*
* **Assistente:** Confirmou e instituiu a diretriz como regra permanente do projeto no topo e no rodapé do `handoff.md`. A cada nova mensagem recebida e respondida, o assistente (seja quem for) tem a obrigação de registrar a interação no diário de bordo.

---

### [2026-10-15 15:41] — Interação 30: Autorização de Hiper-Verbosidade e Profundidade Técnica
* **Usuário:** *"Além disso, pode ser extremamente verboso e descritivo nos lugares onde você achar melhor. Afinal, este não precisa ser um arquivo que precisa ser legível para mim, mas sim descritivo para que você possa entender os detalhes, então não tem problema se este arquivo ficar muito grande."*
* **Assistente:** Expandiu massivamente o `handoff.md` com justificativas teóricas formais de banco (1FN, 2FN, 3FN), explicações detalhadas de engenharia sobre os tipos de dados (`DECIMAL` vs `FLOAT`, `TINYINT`, `RESTRICT` vs `CASCADE`), rotas da API oficial (`GET /obras`, `POST /emprestimos`), e consagrou a permissão para expansão descritiva contínua sem limites de tamanho.
